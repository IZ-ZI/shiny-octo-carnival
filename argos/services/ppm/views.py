# django imports
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods
from .. import models
# python lib imports
from datetime import datetime as dt
from datetime import date
from datetime import timedelta
import json, requests, os.path, base64, dateutil, dateutil.parser, datetime
from os import path
import pytz
# third party imports
from ..ml_toolkit import sample

utc = pytz.UTC

# default services
@require_http_methods(['GET'])
def argusinfo(request):
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    BODY['clientservices'] = 'retrieve_argusinfo'
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        print('error!')
        return JsonResponse(BODY, status=500)
    id = getId(request.headers.get('X-API-SESSION'))
    user = User.objects.get(username=id)
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    params = {
        'username': user.username,
        'firstName': user.first_name,
        'lastName': user.last_name,
        'email': user.email,
        'dateJoined': user.date_joined,
        'phone': user.profile.phone
    }
    BODY['output'] = params
    BODY['status'] = 'COMPLETED_OK'
    return JsonResponse(BODY, status=200)

@require_http_methods(['GET'])
def zoominfo(request):
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    BODY['clientservices'] = 'me@zoom'
    id = getId(request.headers.get('X-API-SESSION'))
    user = User.objects.get(username=id)
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    token = user.profile.token
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
    # zoom returned body parameters
    firstname = data['first_name']
    lastname = data['last_name']
    email = data['email']
    pmi = data['pmi']
    pmurl = data['personal_meeting_url']
    # feedback to GUI
    param = {
        'first_name': firstname,
        'last_name': lastname,
        'email': email,
        'personal_meeting_id': pmi,
        'personal_meeting_url': pmurl
    }
    BODY['output'] = param
    BODY['status'] = 'COMPLETED_OK'
    return JsonResponse(BODY, status=200)

# meeting handlers
@require_http_methods(['POST', 'GET', 'DELETE'])
def meetinghandler(request):
    ## meeting params
    # types: 0 (zoom), 1 (in person)
    # status: 0 (future meeting), 1 (in progress), 2 (finished), 3 (report ready)
    # meeting duration (optional field)
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    id = getId(request.headers.get('X-API-SESSION'))
    user = User.objects.get(username=id)
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    if request.method == 'POST':
        # need to fix for modify event

        BODY['clientservices'] = 'create_meeting'
        # load jsons
        data = json.loads(request.body.decode('utf-8'))
        topic = data['topic']
        types = data['type']
        starttime = data['startTime']
        print(starttime)
        hours = data['duration-hour']
        minutes = data['duration-minute']
        # store into db
        meeting = models.Meeting.objects.create(user=user)
        meeting.m_topic = topic
        meeting.m_creation = datetime.datetime.now()
        meeting.m_date = starttime
        meeting.m_length = str(hours) + ':' + str(minutes)
        meeting.m_type = types
        meeting.save()
        user.save()
        BODY['output'] = json.dumps(data)
        BODY['status'] = 'COMPLETED_OK'
        return JsonResponse(BODY, status=200)
    elif request.method == 'GET':
        # query for all meetings
        allmeetings = models.Meeting.objects.filter(user_id=user.id)
        meetings = []
        for meeting in allmeetings:
            # if meeting doesn't have topic, then skip it.
            if meeting.m_topic is None:
                continue
            date_time = meeting.m_date
            value = dateutil.parser.isoparse(date_time)
            localDatetime = value.astimezone(pytz.timezone('America/Toronto'))
            strified_mdy = str(localDatetime.strftime('%m/%d/%Y'))
            strified_time = str(localDatetime.strftime('%H:%M %p'))
            status = -1
            if value > utc.localize(dt.utcnow()):
                # meeting is in the future
                status = 0
            elif value < utc.localize(dt.utcnow()):
                # meeting has finished
                status = 2
            if meeting.is_report == True:
                status = 3
            meeting = {
                'id': meeting.m_id,
                'date': strified_mdy,
                'time': strified_time,
                'topic': meeting.m_topic,
                'type': meeting.m_type,
                'status': status
            }
            meetings.append(meeting)
        BODY['clientservices'] = 'get_all_meetings'
        BODY['output'] = json.dumps(meetings)
        BODY['status'] = 'COMPLETED_OK'
        return JsonResponse(BODY, status=200)
    elif request.method == 'DELETE':
        # get meeting id
        data = json.loads(request.body.decode('utf-8'))
        m_id = data['id']
        meeting = models.Meeting.objects.get(user=user, m_id=m_id)
        meeting.delete()
        BODY['clientservices'] = 'delete_meeting'
        BODY['output'] = json.dumps(data)
        BODY['status'] = 'COMPLETED_OK'
        return JsonResponse(BODY, status=200)

@require_http_methods(['POST'])
def getmindmap(request):
    BODY = {
        'clientservices': 'get_mindmap',
        'output': '',
        'status': ''
    }
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    id = getId(request.headers.get('X-API-SESSION'))
    user = User.objects.get(username=id)
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    # get id, and ml params
    data = json.loads(request.body.decode('utf-8'))
    m_id = data['id']
    layer_number = data['layerNumber']
    layer_size = data['layerSize']
    leaf_size = data['sentenceNumber']
    words = data['keywords']
    print(m_id, layer_number, layer_size, leaf_size, words)
    file_loc = os.getcwd() + '/m_records/vtts/' + str(m_id) + '.vtt'
    altfile_loc = os.getcwd() + '/m_records/vtts/' + str(m_id) + '.txt'
    print(file_loc)
    if path.exists(file_loc):
        print('file found')
        trans = sample.get_transcript(file_loc)
        mmap = sample.text2mindmap(trans, layer_number, layer_size, leaf_size, words)
        BODY['output'] = json.dumps(mmap)
        BODY['status'] = 'COMPLETED_OK'
        print(BODY)
        return JsonResponse(BODY, status=200)
    elif path.exists(altfile_loc):
        print('file found')
        with open(altfile_loc, 'r') as f:
            content = f.readlines()
            text = ""
            for line in content:
                text += " " + line
            mmap = sample.text2mindmap(text, layer_number, layer_size, leaf_size, words)
        BODY['output'] = json.dumps(mmap)
        BODY['status'] = 'COMPLETED_OK'
        print(BODY)
        return JsonResponse(BODY, status=200)
    else:
        print('file not found')
        BODY['output'] = 'There was an error fetching mindmap, mindmap could have been not generated.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)

@require_http_methods(['GET'])
def meetingStats(request):
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    BODY['clientservices'] = 'meeting_stats'
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    id = getId(request.headers.get('X-API-SESSION'))
    user = User.objects.get(username=id)
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    allmeetings = models.Meeting.objects.filter(user_id=user.id)
    # get today's meetings
    day_m = 0
    week_m = 0
    report = 0
    for meeting in allmeetings:
        if meeting.m_topic is None:
            # we skip empty meetings without headers
            continue
        date_time = meeting.m_date
        value = dateutil.parser.isoparse(date_time)
        value = value.astimezone(pytz.timezone('America/Toronto'))
        if value.date() == dt.today().date():
            day_m += 1
        today = date.today()
        start = today - timedelta(days=today.weekday())
        end = start + timedelta(days=6)
        if (start <= value.date() <= end):
            week_m += 1
        if meeting.is_report == True:
            report += 1
    params = {
        'today': day_m,
        'week': week_m,
        'report': report,
    }
    BODY['output'] = params
    BODY['status'] = 'COMPLETED_OK'
    return JsonResponse(BODY, status=200)

@require_http_methods(['GET'])
def meetingGraphs(request):
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    BODY['clientservices'] = 'meeting_graphs'
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    id = getId(request.headers.get('X-API-SESSION'))
    user = User.objects.get(username=id)
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    allmeetings = models.Meeting.objects.filter(user_id=user.id)
    meeting_freq = {}
    params = []
    for meeting in allmeetings:
        if meeting.m_topic is None:
            # we skip empty meetings without headers
            continue
        date_time = meeting.m_date
        value = dateutil.parser.isoparse(date_time)
        value = value.astimezone(pytz.timezone('America/Toronto'))
        try:
            kv = meeting_freq.get(str(value.date()))
            meeting_freq[str(value.date())] = kv + 1
        except Exception as e:
            # meeting not hashed yet
            # set as 0
            meeting_freq[str(value.date())] = 1
    for key, value in meeting_freq.items():
        p = {'Date': key, 'Number of Meetings': value}
        params.append(p)
    BODY['output'] = json.dumps(params)
    BODY['status'] = 'COMPLETED_OK'
    return JsonResponse(BODY, status=200)

# user information updates
@require_http_methods(['POST'])
def passwordHandler(request):
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    BODY['clientservices'] = 'update_password'
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    id = getId(request.headers.get('X-API-SESSION'))
    user = User.objects.get(username=id)
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    data = json.loads(request.body.decode('utf-8'))
    try:
        password = data['password']
        user.set_password(password)
        user.save()
        BODY['output'] = 'password has been updated.'
        BODY['status'] = 'COMPLETED_OK'
    except:
        BODY['output'] = 'password failed to updated.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
    return JsonResponse(BODY, status=200)

@require_http_methods(['POST', 'GET'])
def nameHandler(request):
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    id = getId(request.headers.get('X-API-SESSION'))
    # get user object
    user = User.objects.get(username=id)
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        first = None
        last = None
        try:
            first = data['firstName']
        except:
            first = None
        try:
            last = data['lastName']
        except:
            last = None
        if first is not None:
            user.first_name = first
        else:
            user.first_name = ''
        if last is not None:
            user.last_name = last
        else:
            user.last_name = ''
        user.save()
        params = {
            'firstName': first,
            'lastName': last
        }
        BODY['clientservices'] = 'update_name'
        BODY['output'] = params
        BODY['status'] = 'COMPLETED_OK'
    elif request.method == 'GET':
        params = {
            'first': user.first_name,
            'last': user.last_name
        }
        BODY['clientservices'] = 'retrieve_name'
        BODY['output'] = params
        BODY['status'] = 'COMPLETED_OK'
    return JsonResponse(BODY, status=200)

@require_http_methods(['POST', 'GET'])
def emailHandler(request):
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    id = getId(request.headers.get('X-API-SESSION'))
    # get user object
    user = User.objects.get(username=id)
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        user.email = data['email']
        user.save()
        params = {
            'email': data['email']
        }
        BODY['output'] = params
        BODY['status'] = 'COMPLETED_OK'
    elif request.method == 'GET':
        params = {
            'email': user.email
        }
        BODY['output'] = params
        BODY['status'] = 'COMPLETED_OK'
    return JsonResponse(BODY, status=200)


@require_http_methods(['POST', 'GET'])
def phoneHandler(request):
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    id = getId(request.headers.get('X-API-SESSION'))
    # get user object
    user = User.objects.get(username=id)
    if user is None:
        BODY['output'] = 'Internal server error. Unable to validate user authenticity from session.'
        BODY['status'] = 'COMPLETED_WITH_ERROR'
        return JsonResponse(BODY, status=500)
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        phone = None
        try:
            phone = data['phone']
        except:
            phone = None
        if phone is not None:
            user.profile.phone = data['phone']
            user.save() 
        params = {
            'phone': data['phone']
        }
        BODY['output'] = params
        BODY['status'] = 'COMPLETED_OK'
    elif request.method == 'GET':
        params = {
            'phone': user.profile.phone
        }
        BODY['output'] = params
        BODY['status'] = 'COMPLETED_OK'
    return JsonResponse(BODY, status=200)

@require_http_methods(['POST'])
def renewsession(request):
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    BODY['clientservices'] = 'refresh_access_token'
    user = User.objects.get(username=getId(request.headers.get('X-API-SESSION')))
    r = exe_refresh(user.profile.renew)
    if r.status_code != 200:
        BODY['output'] = 'core services failed to renew session from Zoom OAuth.'
        BODY['status'] = 'FAILED_TO_COMPLETE'
        return JsonResponse(BODY, status=500)
    data = json.loads(r.text)
    # zoom returned body parameters
    token = data['access_token']
    ttype = data['token_type']
    ref_token = data['refresh_token']
    ttl = data['expires_in']
    scope = data['scope']
    # feedback to GUI
    param = {
        'token': token,
        'token_type': ttype,
        'refresh_token': ref_token,
        'expiration_time': ttl,
    }
    BODY['output'] = param
    BODY['status'] = 'COMPLETED_OK'
    return JsonResponse(BODY, status=200)

@require_http_methods(['POST'])
def logout(request):
    BODY = {
        'clientservices': '',
        'output': '',
        'status': ''
    }
    BODY['clientservices'] = 'logout'
    if request.headers.get('X-API-SESSION') is None:
        BODY['output'] = 'Internal server error. Session key not provided.'
        BODY['status'] = 'FAILED_TO_START'
        return JsonResponse(BODY, status=500)
    # remove session keypair
    if removeSession(request.headers.get('X-API-SESSION')):
        BODY['output'] = 'User has performed logout. Session detached.'
        BODY['status'] = 'COMPLETED_OK'
        return JsonResponse(BODY, status=200)
    else:
        BODY['output'] = 'Internal server error. Session not able to detach completely.'
        BODY['status'] = 'FAILED_TO_COMPLETE'
        return JsonResponse(BODY, status=500)

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
            list = line.split('=', 1)
            return list[1]

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

def removeSession(session_key):
    # find id in session_keypair
    filename = 'session_keypair.ini'
    if not os.path.isfile(filename):
        # file dne
        print('keypair file not found or corrupted.')
    else:
        with open(filename) as f:
            content = f.read().splitlines()
    found = False
    for line in content:
        if session_key in line:
            found = True  
    if found:
        # remove current session
        file = open(filename, 'w')
        for line in content:
            if session_key not in line:
                file.write(line + '\n')


        # validate that session has been removed
        with open(filename) as f:
            content = f.read().splitlines()

        for line in content:
            if session_key in line:
                return False
        return True
    else:
        return False

def getStaticAuthHeader():
    id = getFileKey('clientid')
    secret = getFileKey('clientsecret')
    return 'Basic ' + base64.b64encode(bytes(id + ':' + secret, 'utf-8')).decode('utf-8')

def exec_refresh(token):
    base_uri = getFileKey('zoom_oauth_token_url')
    # create url to POST to Zoom OAuth
    url = base_uri + '?grant_type=refresh_token&refresh_token=' + token
    # header with Authorization
    header = {
        'Authorization': getStaticAuthHeader()
    }
    payload = {}
    r = requests.post(url, data=json.dumps(payload), headers=header)
    return r