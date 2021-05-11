from django.urls import path
from django.contrib import admin

from .. import views

urlpatterns = [
    # public paths
    path('account/argus/', views.argusinfo),
    path('account/zoom/', views.zoominfo),
    path('renew-session/', views.renewsession),
    path('account/profile/password/', views.passwordHandler),
    path('account/profile/name/', views.nameHandler),
    path('account/profile/email/', views.emailHandler),
    path('account/profile/phone/', views.phoneHandler),
    path('logout/', views.logout),
    path('account/meetingscheduler/', views.meetinghandler)
]