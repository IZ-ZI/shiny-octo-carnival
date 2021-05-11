from django.urls import path
from django.contrib import admin

from .. import views

urlpatterns = [
    # hidden paths
    path('setup/redirected', views.oauthToken),
    path('setup/webhooks/', views.hooks),
    # public paths
    path('login/', views.login),
    path('signup/', views.signup),
    path('lossnfound/', views.forgotpswd),
    path('zoomlinker', views.linkZoomSession),
    # dev paths
    path('devservice/', views.dev)
]