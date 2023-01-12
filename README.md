# Invoicing Application

## Description

My Invoicing application API built with NestJs and Typescript. After watching a ton of NestJs Tutorials I am trying to build an invoicing application using NestJs as the backend framework and using Typescript

## Features & Structure

### Features

1. Login

2. A user should be able to view their profile, change their password and update their profile

3. User should be able to reset their password using the forgot password route

4. A user can have companies that sends invoices and ones that receive invoices.

5. A user can get all their invoices

6. A user can create invoices.

7. A user can view an invoice

8. A user can send an invoice

9. The email is sent to the contact email and if there are any carbon copy emails they will be copied

10. A user can generate invoice pdf

11. A user can delete an invoice

12. A user can mark an invoice as paid

13. A user can update their invoices by adding more invoice lines or removing invoice lines or updating old invoice lines

14. user can see all their companies (sender and recipient)

[ ] admin user can view all users

[ ] Users marked as admins can invite other users to use the platform

[ ] Inviting a user sends an email to the user

[ ] admin can invoke an invite that is not claimed or not expired

[ ] admin can resend invites even if it has expired

[ ] user can accept a pending invite that is not expired or revoked

[ ] admin user can view all invites

### Model/DB Structure

User - name, email {unique}, password, is_admin

Company (Sender) - id, uuid, name, email, phone, address, tax number, checks_payable to (name) - belongs to user

Company (Recipient) - id, uuid, name, address, country, city, zip code, contact email, carbon copy emails - belongs to user

Invoice - invoice number, user, sending company, receiving company, invoice amount, paid_at, timestamps

Invoice Line - invoice_id, description, price, timestamps

Invites - email, token, expires_at, accepted_at timestamps

## Installation

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
