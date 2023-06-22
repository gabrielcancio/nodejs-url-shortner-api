# Requirements of the System
The URL shortening service like Tiny-URL should have the following features:

## Functional Requirements
* Users should be able to generate a shortened URL from the original URL.
* The short link should redirect users to the original link.
* Users should have the option to give a custom short link for their URL.

## Design Goals
* If the system fails, it will imply that all the short links will not function. Therefore, our system should be highly available.
* URL redirection should happen in real-time with minimal latency.
* Shortened links should not be predictable in any manner.

## Extended/Optional Goals
* The service should be REST API accessible.
* Analytics: How many times the URL is visited?
* Users should be able to specify the expiration time of the URL.