from django.urls import path
from . import views

urlpatterns = [

    path('', views.landing, name = 'landing'),
    
    path('login/', views.loginPage, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name = "logout"),
    
    path('dashboard/', views.dahsboardPage, name = "dashboard"),

    path('site/', views.site, name = "site"),
    
    path('extract/', views.extract_filtered_data, name='extract_filtered_data'),

    
]