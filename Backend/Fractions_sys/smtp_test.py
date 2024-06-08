import smtplib

try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('your-email@gmail.com', 'your-password-or-app-password')
    print("Logged in successfully")
except smtplib.SMTPAuthenticationError as e:
    print("Failed to log in", e)
