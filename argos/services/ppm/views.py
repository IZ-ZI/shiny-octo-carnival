# django imports
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods
from .. import models
# python lib imports
from datetime import datetime as dt
import json, requests, os.path, base64, dateutil, dateutil.parser, datetime
import pytz

utc = pytz.UTC

BODY = {
    'clientservices': '',
    'output': '',
    'status': ''
}

# default services
@require_http_methods(['GET'])
def argusinfo(request):
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
        print(request.body)
        data = json.loads(request.body.decode('utf-8'))
        topic = data['topic']
        types = data['type']
        starttime = data['startTime']
        hours = data['duration-hour']
        minutes = data['duration-minute']
        print(topic, types, starttime, hours, minutes)
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
            if (value > utc.localize(dt.utcnow())):
                # meeting is in the future
                status = 0
            elif (value < utc.localize(dt.utcnow())):
                # meeting has finished
                status = 2
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


# user information updates
@require_http_methods(['POST'])
def passwordHandler(request):
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
    if request.method == 'POST':
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
        try:
            first = data['firstName']
            last = data['lastName']
        except:
            pass
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

@require_http_methods(['POST'])
def emailHandler(request):
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


@require_http_methods(['POST'])
def phoneHandler(request):
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