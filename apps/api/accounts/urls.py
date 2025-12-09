from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    CNICLoginView,
    LogoutView,
    UserRegistrationView,
)
from django.urls import path


urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # User Registration
    path("register/", UserRegistrationView.as_view(), name="register"),
    # Login using CNIC
    path("login/", CNICLoginView.as_view(), name="cnic_login"),

    # Logout + blacklist
    path("logout/", LogoutView.as_view(), name="logout"),

]
