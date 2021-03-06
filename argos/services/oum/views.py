# django imports
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods
from .. import models
# python lib imports
from datetime import datetime as dt
import json, base64, os.path, requests, time, datetime, random, shutil, dateutil.parser
# third-party imports
from backports.pbkdf2 import pbkdf2_hmac
from fnmatch import fnmatch
from ..ml_toolkit import sample

# could deprecate
@require_http_methods(['GET'])
def oauthToken(request):
    code = request.GET.dict()['code']
    # zoom_code.append(code)
    # # intended to return nothing, similar to async to wait for GUI feedback
    # # POST to Zoom OAuth
    # BODY['authentication'] = 'oathToken'
    # r = post2Zoom(code)
    # if r.status_code != 200:
    #     BODY['output'] = 'core services failed to initiate session from Zoom OAuth.'
    #     BODY['status'] = 'FAILED_TO_COMPLETE'
    #     return JsonResponse(BODY, status=500)
    # data = json.loads(r.text)
    # # zoom returned body parameters
    # token = data['access_token']
    # ttype = data['token_type']
    # ref_token = data['refresh_token']
    # ttl = data['expires_in']
    # scope = data['scope']
    # # feedback to GUI
    # param = {
    #     'token': token,
    #     'token_type': ttype,
    #     'refresh_token': ref_token,
    #     'expiration_time': ttl,
    # }
    BODY = {
        'authentication': '',
        'output': '',
        'status': ''
    }
    BODY['authentication'] = 'web-based authentication is deprecated. Will be removed in next office version release'
    BODY['output'] = {}
    BODY['status'] = 'COMPLETED_OK'
    return HttpResponse()

@require_http_methods(['GET'])
def linkZoomSession(request):
    BODY = {
        'authentication': '',
        'output': '',
        'status': ''
    }
    BODY['authentication'] = 'connect_zoom_session'
    code = request.GET.dict()['code']
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    # POST to Zoom OAuth
    BODY['authentication'] = 'oathToken'
    r = post2Zoom(code)
    if r.status_code != 200:
        BODY['output'] = 'core services failed to initiate session from Zoom OAuth.'
        BODY['status'] = 'FAILED_TO_COMPLETE'
        return JsonResponse(BODY, status=500)
    data = json.loads(r.text)
    # zoom returned body parameters
    token = data['access_token']
    ttype = data['token_type']
    ref_token = data['refresh_token']
    ttl = data['expires_in']
    scope = data['scope']
    # we take zoom id on the way for webhook meeting classification
    url = 'https://api.zoom.us/v2/users/me'
    header = {
        'Authorization': 'Bearer ' + token
    }
    acc_info = requests.get(url, headers=header)
    if acc_info.status_code != 200:
        BODY['output'] = 'core services failed to retrieve Zoom Profile.'
        BODY['status'] = 'FAILED_TO_COMPLETE'
        return JsonResponse(BODY, status=500)
    data = json.loads(acc_info.text)
    # store in db
    user = User.objects.get(username=getId(request.headers.get('X-API-SESSION')))
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    # store in db
    user.profile.token = token
    user.profile.zoom_id = data['id']
    user.profile.renew = ref_token
    user.profile.llt = dt.utcnow()
    user.save()
    # feedback to GUI
    param = {
        'token': token,
        'token_type': ttype,
        'refresh_token': ref_token,
        'expiration_time': ttl,
    }
    BODY['authentication'] = 'oauthToken'
    BODY['output'] = param
    BODY['status'] = 'COMPLETED_OK'
    return JsonResponse(BODY, status=200)

@require_http_methods(['PUT'])
def signup(request):
    BODY = {
        'authentication': '',
        'output': '',
        'status': ''
    }
    BODY['authentication'] = 'signup'
    data = json.loads(request.body.decode('utf-8'))
    id = data['username']
    email = data['email']
    password = data['password']
    if (id or email or password) is None:
        BODY['output'] = 'Attempting to create user with empty field. (Fields must not be null or empty). Please check values and try again.!'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    user = User.objects.create_user(id, email, password)
    if user is not None:
        # return registered parameters
        params = {
            'username': id,
            'email': email,
            'key': password
        }
        BODY['output'] = params
        BODY['status'] = 'COMPLETED_OK'
        return JsonResponse(BODY, status=200)
    else:
        # give error
        BODY['output'] = 'Internal service error. Unable to allocate resources to create user!'
        BODY['status'] = 'FAILED_TO_COMPLETE'
        return JsonResponse(BODY, status=500)

@require_http_methods(['POST'])
def login(request):
    BODY = {
        'authentication': '',
        'output': '',
        'status': ''
    }
    data = json.loads(request.body.decode('utf-8'))
    id = data['username']
    pswd = data['password']
    print(id, pswd)
    # do something
    user = authenticate(username=id, password=pswd)
    BODY['authentication'] = 'login'
    if user is not None:
        # login
        storeSession(id)
        # auto renew existent zoom tokens
        renewed = False
        if user.profile.token is not None:
            # auto renew session
            base_uri = getFileKey('zoom_oauth_token_url')
            # create url to POST to Zoom OAuth
            url = base_uri + '?grant_type=refresh_token&refresh_token=' + user.profile.renew
            # header with Authorization
            header = {
                'Authorization': getStaticAuthHeader()
            }
            payload = {}
            r = requests.post(url, data=json.dumps(payload), headers=header)
            if r.status_code == 200:    
                data = json.loads(r.text)
                # store in db
                user.profile.token = data['access_token']
                user.profile.renew = data['refresh_token']
                user.profile.llt = datetime.datetime.now()
                user.save()
                renewed = True
        params = {
            'userid': id,
            'password': pswd,
            'zoom-subscription': renewed,
            'X-API-SESSION': getSession(id)
        }
        BODY['output'] = params
        BODY['status'] = 'COMPLETED_OK'
        return JsonResponse(BODY, status=200)
    else:
        # give error
        BODY['output'] = 'Invalid credentials supplied. Unable to validate user!'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)

@require_http_methods(['POST'])
def forgotpswd(request):
    return JsonResponse()

@require_http_methods(['POST'])
def hooks(request):
    BODY = {
        'authentication': '',
        'output': '',
        'status': ''
    }
    print(request.body.decode('utf-8'))
    data = json.loads(request.body.decode('utf-8'))
    # we determine event for meetings
    event = data['event']
    cur_path = os.path.dirname(__file__)
    if event == 'meeting.started':
        uuid = data['payload']['object']['uuid'].replace('/', '-')
        host_id = data['payload']['object']['host_id']
        # time in UTC
        start = data['payload']['object']['start_time']
        # we start a file recording all possible participants
        new_path = cur_path + '/buffer/' + uuid + '-' + host_id + start + '.txt'
        with open(new_path, 'w') as f:
            # do nothing, only open file
            f.close()
    elif event == 'meeting.ended':
        # we finish a file
        uuid = data['payload']['object']['uuid'].replace('/', '-')
        host_id = data['payload']['object']['host_id']
        user = models.Profile.objects.get(zoom_id=host_id)
        if user is not None:
            # found the host
            for filename in os.listdir('./services/oum/buffer/'):
                if str(host_id) in filename:
                    if str(uuid) in filename:
                        if not os.path.exists('./m_records/' + host_id + '/'):
                            os.makedirs('./m_records/' + host_id + '/')
                        shutil.move(cur_path + '/buffer/' + filename, os.getcwd() + '/m_records/' + host_id + '/' + filename)
                        values = filename.split('-')
                        # find length of meeting
                        start = dateutil.parser.parse(data['payload']['object']['start_time'])
                        end = dateutil.parser.parse(data['payload']['object']['end_time'])
                        td = end - start
                        # create new meeting entry in db
                        meeting = models.Meeting.objects.create(user=User.objects.get(id=user.user_id))
                        meeting.m_topic = data['payload']['object']['topic']
                        meeting.m_creation = start
                        meeting.m_date = start
                        meeting.m_length = str(td.seconds//3600) + ':' + str((td.seconds//60)%60)
                        meeting.m_type = '0'
                        meeting.m_uuid = uuid
                        meeting.save()
                        user.save()
                        # 
    elif event == 'meeting.participant_joined':
        uuid = data['payload']['object']['uuid'].replace('/', '-')
        host_id = data['payload']['object']['host_id']
        # time in UTC
        start = data['payload']['object']['start_time']
        if os.path.isfile(cur_path + '/buffer/' + uuid + '-' + host_id + start + '.txt'):
            new_path = cur_path + '/buffer/' + uuid + '-' + host_id + start + '.txt'
            with open(new_path, 'a') as f:
                # get participant id, name, email, join time
                id = data['payload']['object']['participant']['user_id']
                name = data['payload']['object']['participant']['user_name']
                email = data['payload']['object']['participant']['email']
                time = data['payload']['object']['participant']['join_time']
                f.write(str(id) + ", " + str(name) + ", " + str(email) + ", " + str(time) + ", " + 'joined\n')
    elif event == 'meeting.participant_left':
        uuid = data['payload']['object']['uuid'].replace('/', '-')
        host_id = data['payload']['object']['host_id']
        # time in UTC
        start = data['payload']['object']['start_time']
        if os.path.isfile(cur_path + '/buffer/' + uuid + '-' + host_id + start + '.txt'):
            new_path = cur_path + '/buffer/' + uuid + '-' + host_id + start + '.txt'
            with open(new_path, 'a') as f:
                # get participant id, name, email, left time
                id = data['payload']['object']['participant']['user_id']
                name = data['payload']['object']['participant']['user_name']
                email = data['payload']['object']['participant']['email']
                time = data['payload']['object']['participant']['leave_time']
                f.write(str(id) + ", " + str(name) + ", " + str(email) + ", " + str(time) + ", " + 'left\n')
    elif event == 'recording.transcript_completed':
        meeting_id = data['payload']['object']['uuid'].replace('/', '-')
        r_files = data['payload']['object']['recording_files']
        host_id = data['payload']['object']['host_id']
        download_url = None
        token = None
        for i in range(len(r_files)):
            r_file = r_files[i]
            if r_file['file_extension'] == 'VTT':
                download_url = r_file['download_url']
                token = data['download_token']
                break
        if download_url is not None and token is not None:
            header = {
                'Authorization': 'Bearer ' + token
            }
            payload = requests.get(download_url, headers=header)
            if payload.status_code == 200:
                meeting = models.Meeting.objects.get(m_uuid=meeting_id)
                if meeting is not None:
                    meeting.is_report = True
                    meeting.save()
                # create mindmap
                print(payload.content.decode('utf-8'))
                temp_vtt = os.getcwd() + '/m_records/vtts/' + str(meeting.m_id) + '.vtt'
                with open(temp_vtt, 'w') as file:
                    file.write(payload.content.decode('utf-8'))
                mmap = sample.text2mindmap(sample.get_transcript(temp_vtt))
                # mmap is not generated due to size constraint
                if mmap is None:
                    meeting.is_report = False
                    meeting.save()
    return JsonResponse(data, status=200)

def dev(request):
    return HttpResponse('devops testing api')

def getFileKey(key):
    # read properties file to get values
    filename = 'argos.ini'
    if not os.path.isfile(filename):
        # file dne
        print('properties file not found or corrupted.')
    else:
        with open(filename) as f:
            content = f.read().splitlines()
    
    for line in content:
        if key in line:
            value = line.split('=', 1)
            return value[1]

def storeSession(id):
    # store id into session_keypair
    filename = 'session_keypair.ini'
    if not os.path.isfile(filename):
        # file dne
        print('keypair file not found or corrupted.')
    else:
        with open(filename) as f:
            content = f.read().splitlines()
    
    found = False
    for line in content:
        keypair = line.split(',', 1)
        if keypair[0] == id:
            found = True

    if found:
        # remove current session
        file = open(filename, 'w')
        for line in content:
            keypair = line.split(',', 1)
            if keypair[0] != id:
                file.write(line + '\n')
    # append to file
    file = open(filename, 'a')
    file.write(id + ',' + random_session(id) + '\n')

def random_session(id):
    # generate a session based on time stamp
    return base64.b64encode(os.urandom(800)).decode('utf-8')

def getSession(id):
    # find id in session_keypair
    filename = 'session_keypair.ini'
    if not os.path.isfile(filename):
        # file dne
        print('keypair file not found or corrupted.')
    else:
        with open(filename) as f:
            content = f.read().splitlines()
    
    for line in content:
        keypair = line.split(',', 1)
        if keypair[0] == id:
            return keypair[1]

def getStaticAuthHeader():
    id = getFileKey('clientid')
    secret = getFileKey('clientsecret')
    return 'Basic ' + base64.b64encode(bytes(id + ':' + secret, 'utf-8')).decode('utf-8')

def getId(session_key):
    # find id in session_keypair
    filename = 'session_keypair.ini'
    if not os.path.isfile(filename):
        # file dne
        print('keypair file not found or corrupted.')
    else:
        with open(filename) as f:
            content = f.read().splitlines()
    
    for line in content:
        if session_key in line:
            value = line.split(',', 1)
            return value[0]

def post2Zoom(code):
    base_uri = getFileKey('zoom_oauth_token_url')
    redirect_uri = getFileKey('redirect_uri')
    # create url to POST to Zoom OAuth
    url = base_uri + '?grant_type=authorization_code&code=' + code + '&redirect_uri=' + redirect_uri
    # header with Authorization
    header = {
        'Authorization': getStaticAuthHeader()
    }
    payload = {}
    r = requests.post(url, data=json.dumps(payload), headers=header)
    return r