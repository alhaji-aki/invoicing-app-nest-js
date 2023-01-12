# Invoicing Application

## Description

My Invoicing application API built with NestJs and Typescript. After watching a ton of NestJs Tutorials I am trying to build an invoicing application using NestJs as the backend framework and using Typescript

## Features & Structure

### Features

#### Authentication

    1. Login
    2. Request password reset
    3. Reset password

#### Profile Management

    1. View profile
    2. Update profile
    3. Change Password

#### User Management (Admins Only)

    1. View all users
    2. Change user admin state

#### Invites Management (Admins Only)

    1. View all invites
    2. Send invites
    3. Resend invites
    4. Revoke invites
    5. Accepting invites (Registeration)

#### Invoice Management

    1. View all invoices
    2. Create Invoice
    3. View invoice
    4. Update invoice
    5. Delete invoice
    6. Add invoice lines
    7. Update invoice line
    8. Delete invoice line
    9. Send invoice to email
    10. Download invoice pdf
    11. Mark invoice as paid

#### Companies Management (Both Senders and Recipients)

    1. View all companies
    2. Create companies
    3. View company
    4. Update company
    5. Delete company

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
