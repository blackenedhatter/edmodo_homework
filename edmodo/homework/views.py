from django.shortcuts import render
from django.http import HttpResponse, HttpResponseForbidden
import datetime
from .models import Users, Assignment, Homework, Answers
import json
from django.db.models import Max

# Create your views here.

# Default index from Django
def index(request):
  return HttpResponse("Hello world")

# if POST, creates new Users
def register(request):
  if( request.method == 'POST' ) :
    data = json.loads(request.body)
    uname = data['username']
    passwd = data['password']
    utype = data['usertype']
    rName = data['name']

    newU = Users(username=uname,password=passwd,usertype=utype,name=rName)
    newU.save()

    return HttpResponse("actually register")

  return HttpResponse("register")

# Deletes session
def logout(request) :
  if( request.method == 'POST' ) :
    request.session.flush()

  return HttpResponse('logged out')

# If POST, rudimentary login. 
# Known issue, password is plaintext
def login(request):
  if( request.method == 'POST' ) :
    data = json.loads(request.body)
    uname = data['username']
    passwd = data['password']

    try :
      userObj = Users.objects.get(username=uname,password=passwd)
    except :
      return HttpResponseForbidden('access denied')

    request.session['username'] = uname
    userVals = {'username':getattr(userObj,'username'),'id':getattr(userObj,'id'),'name':getattr(userObj,'name'),'usertype':getattr(userObj,'usertype')}

    return HttpResponse(json.JSONEncoder().encode(userVals))

  return HttpResponse("login service")

# If POST, creates new Homework
# Otherwise returns all Homework
def homework(request):
  if( request.method == 'POST' ) :
    data = json.loads(request.body)
    dueDate = datetime.datetime.strptime(data['duedate'],'%m/%d/%Y').date()

    newHw = Homework(title=data['title'],question=data['question'],duedate=dueDate)
    newHw.save()

    return HttpResponse("new homework success")

    # Create new homework
  else :
    hwObj = Homework.objects.all()
    hwObjList = []
    for ho in hwObj :
      hwObjList.append(ho.getDict())

    return HttpResponse(json.JSONEncoder().encode(hwObjList))

#    [{field.name: getattr(obj,field.name)) for field in obj._meta.fields]
  return HttpResponse("homework")


# Returns a single Homework by ID
def homeworkByHW(request,hwid) :
  hwObj = Homework.objects.get(id=hwid)
  hwDict = hwObj.getDict()
  return HttpResponse(json.JSONEncoder().encode(hwDict))

# Returns JSON of all Users of usertype Student
def students(request):
  studObj = Users.objects.filter(usertype='Student')
  studObjList = []
  for st in studObj :
    studObjList.append(st.getDict())

  return HttpResponse(json.JSONEncoder().encode(studObjList));

# Unused view - TO DELETE
def answers(request):
  return HttpResponse("answers")

# Returns all Answers for a given Homework
def answersByHW(request,hwid):
  hwObj = Homework.objects.get(id=hwid)

  answerList = Answers.objects.filter(homeworkId=hwObj).order_by('-submitted_date')
  answObjList = []
  byUser = {}

  for ans in answerList :
    if( ans.userid.username not in byUser ) :
      answObjList.append(ans.getDict())
      byUser[ans.userid.username] = True

  return HttpResponse(json.JSONEncoder().encode(answObjList));


# If POST, creates a new Answer for a given Homework and Users
# Otherwise, returns all Answers for a given User and Homework
#   ordered by submitted_date Descending
def answersByHWUser(request,hwid,username):
  if( request.method == 'POST' ) :
    data = json.loads(request.body)

    hWrk = Homework.objects.get(id=hwid)
    userObj = Users.objects.get(username=username)

    newAnswer = Answers(homeworkId=hWrk,userid=userObj,answer=data['answer'])
    newAnswer.save()

    return HttpResponse("answers have been delivered")
  else :
    user = Users.objects.get(username=username)
    hwObj = Homework.objects.get(id=hwid)

    answerList = Answers.objects.filter(homeworkId=hwObj,userid=user).order_by('-submitted_date')
    answObjList = []

    for ans in answerList :
      answObjList.append(ans.getDict())

    return HttpResponse(json.JSONEncoder().encode(answObjList));

# If POST creates a new Assignment
def assign(request):
  if( request.method == 'POST' ) :
    data = json.loads(request.body)

    stKeys = data['students'].keys()

    hWrk = Homework.objects.get(id=data['homework'])

    for st in stKeys :
      usr = Users.objects.get(id=st)
      newAsgn = Assignment(homeworkId=hWrk,userid=usr)
      newAsgn.save()

    return HttpResponse("new assignment success")

# Returns all Assignments for a given User.
# Assignment model contains User and Homework
def assignByUser(request,username) :
  usr = Users.objects.get(username=username)
  asgnObjSet = Assignment.objects.filter(userid=usr)
  asgnObjList = []

  for asg in asgnObjSet :
    asgnObjList.append(asg.homeworkId.getDict())

  return HttpResponse(json.JSONEncoder().encode(asgnObjList))

# Unused view, TO DELETE
def assignByHW(request,hwid):
  return HttpResponse("assign homework by HW")

