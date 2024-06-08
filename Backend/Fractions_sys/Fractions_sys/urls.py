
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
import os

urlpatterns = [
   path('auth/',include('djoser.urls')), # other stuff will be handled from this
   path('auth/',include('djoser.urls.jwt')),  # json web tokens path, accsess and refresh token or getting new one
]

index_html_path = 'C:\\Users\\lovto\\X-Ray Project\\Fractures-Captures\\Frontend\\Fractures_Captures\\index.html'

urlpatterns += [re_path(r'^.*',TemplateView.as_view(template_name = index_html_path))]