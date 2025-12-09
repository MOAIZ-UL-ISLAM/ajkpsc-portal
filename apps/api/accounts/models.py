from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, full_name, cnic, gender, dob, password=None):
        if not email:
            raise ValueError('Email is required')

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            full_name=full_name,
            cnic=cnic,
            gender=gender,
            dob=dob
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, cnic, gender, dob, password=None):
        user = self.create_user(
            email=email,
            full_name=full_name,
            cnic=cnic,
            gender=gender,
            dob=dob,
            password=password
        )

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    cnic = models.CharField(max_length=13, unique=True)

    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    )
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    dob = models.DateField()

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "cnic"
    REQUIRED_FIELDS = ["full_name", "email", "gender", "dob"]

    def __str__(self):
        return self.email

    class Meta:
        db_table = "users"
        ordering = ["-id"]
