### Reddit Sentiment Analyser
A full-stack web application developed with a partner for a Cloud Computing subject. The application pulls user posts and comments via the Reddit API, and utilises the Node-NLP package to perform a Named Entity Recognition and sentiment analysis to rate the sentiment towards certain topics. This application worked particularly well for sporting subreddits such as r/NRL, r/NFL, etc. It has persistent storage through DynamoDB and Redis, but this is no longer functional without the AWS credentials supplied by the subject.

# AWS Deployment
This project was deployed to AWS, scaling in and out to multiple ec2 instances, through an auto-scaling group and load balancer. Scaling was dependant on the CPU load generated by running multiple apps.