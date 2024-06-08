from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager



class UserAccountManager(BaseUserManager):
    def create_user(self,email,name,password = None):
        if not email:
            raise ValueError('Users must have email address')
        email = self.normalize_email(email)  # Normalizing the email like: TaL@gmail.... into tal@gmail....
        user = self.model(email = email, name = name)

        user.set_password(password)
        user.save
        return user


class userAccount(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(max_length=255,unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']


    def getFullName(self):
        return self.name
    def getShortName(self):
        return self.name
    def __str__(self):  # string represntation of this obj
        return self.email