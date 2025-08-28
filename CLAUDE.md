You are building the frontend of a professional e-business card website.

Backend auth documentation (dev environment): https://backend-569416603085.us-east1.run.app/auth/openapi.json
Backend API documentation (dev environment): https://backend-569416603085.us-east1.run.app/api/openapi.json

The gist of the website is simple. Users will be able to:

- Create a business card, called a "profile"
- Share their business card
- Collect contacts via a simple form

Long term, the goal is to build out a mobile app. For now, we are building just a website that is mobile responsive.
It is very important that it works well on mobile browsers, so compatibility is of utmost importance. When it comes
time to build mobile apps, we want to be able to transition the designs easily, so we need components that are not
tricky to move between clients.

We are only concerned with free tier users for now. There is no payment collection, paywall, or subscription model yet.
I will remove this paragraph and update with that context when it is time to handle that.

Some notes about free tier usage:

- Users are limited to 1 profile.
  - The API is designed to support multiple profiles per user, but the backend will respond with an error code
    if we try to do this. Eventually, paying users will be able to create more.

Right now we are in rapid development/design mode. We need to get it working and looking good.
