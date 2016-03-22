from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'register/?', views.register, name='register'),
    url(r'login/?', views.login, name='login'),
    url(r'logout/?', views.logout, name='logout'),
    url(r'homework/?$', views.homework, name='homework'),
    url(r'homework/(?P<hwid>[0-9]+)/?', views.homeworkByHW, name='homeworkByHW'),
    url(r'students/?', views.students, name='students'),
    url(r'answers/?$', views.answers, name='answers'),
    url(r'answers/(?P<hwid>[0-9]+)/?$', views.answersByHW, name='answersByHW'),
    url(r'answers/(?P<hwid>[0-9]+)/(?P<username>[a-zA-Z0-9_]+)/?$', views.answersByHWUser, name='answersByHWUser'),
    url(r'assign/?$', views.assign, name='assign'),
    url(r'assign/(?P<hwid>[0-9]+)/?$', views.assignByHW, name='assignByHW'),
    url(r'assign/(?P<username>[a-zA-Z0-9_]+)/?$', views.assignByUser, name='assignByUser'),
]
