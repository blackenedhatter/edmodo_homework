from __future__ import unicode_literals

from django.db import models

# Users model for both Students and Teachers
class Users(models.Model):
  userTypes = ( ( 'Student','Student' ), ( 'Teacher','Teacher' ) )
  username = models.CharField(max_length=16, unique=True)
  name = models.CharField(max_length=64, default='')
  usertype = models.CharField(max_length=8, choices=userTypes, default='Student')
  password = models.CharField(max_length=256)

  def __str__(self):
    return self.username

  def getDict(self) :
    return { 'id': self.id, 'usertype': self.usertype, 'name': self.name, 'username': self.username };

# Hoomework model
class Homework(models.Model) :
  title = models.CharField(max_length=256)
  question = models.CharField(max_length=50000)
  duedate = models.DateField('due date')

  def __str__(self):
    return str(self.id)

  def getDict(self) :
    return { 'id': self.id, 'title': self.title, 'question': self.question, 'duedate': str(self.duedate) };

# Answers model. Contains Homework and User via foreign key
class Answers(models.Model) :
  submitted_date = models.DateTimeField(auto_now_add=True)
  homeworkId = models.ForeignKey( Homework,
                                  on_delete=models.CASCADE )
  userid = models.ForeignKey(Users, on_delete=models.CASCADE )
  answer = models.TextField(default='')

  def __str__(self):
    return str(self.userid)+":"+str(self.homeworkId)+":"+str(self.submitted_date)

  def getDict(self) :
    return { 'submitted_date': str(self.submitted_date), 'homeworkId': self.homeworkId.getDict(), 'userid': self.userid.getDict(), 'answer': self.answer }

# Assignment model. Contains Homework and User via foreign key
class Assignment(models.Model) :
  homeworkId = models.ForeignKey(Homework, on_delete=models.CASCADE )
  userid = models.ForeignKey(Users, on_delete=models.CASCADE )

  def __str__(self):
    return str(self.userid)+":"+str(self.homeworkId)


  
  
# Create your models here.
