## What it does?

- Creating users via API
- Creating boarding pass for user via API
- Updating boarding pass when user arrived via API
- Displaying map of users that arrived(updates every 10 seconds)
- Displaying latest arrived user(realtime)

## Setup

### Using kubernetes

#### Using remote image from docker hub

- switch to branch docker_hub
- `kubectl apply -f kube`
- `kubectl get pods --watch` and wait for both services to have status RUNNING
- `minikube service aita-invites --url` and paste it to browser on postman collection to be able access the service

#### Using local remote image

- Before proceed with next steps make sure that kubernetes and minikube is installed or other alternatives
- `yarn install`
- `yarn build`
- to make accessible future builded image in minikube run `eval $(minikube docker-env)` it basically docker daemon inside minikube instance
- build docker image so it could be pulled locally `docker build -t aita_invites . -f kube/Dockerfile`
- `kubectl apply -f kube`
- `kubectl get pods --watch` and wait for both services to have status RUNNING
- `minikube service aita-invites --url` and paste it to browser on postman collection to be able access the service


### Using docker-compose(local development)

- attach to runner `docker-compose run --rm runner`
  - run `yarn install`
  - run `yarn db-migrate db:create --config config/database.json -e setup aita_invites_dev` to setup dev db
  - run `yarn db-migrate up --config config/database.json -e dev` to migrate dev db
  - run `yarn db-migrate db:create --config config/database.json -e setup aita_invites_test` to setup test db
  - run `yarn db-migrate up --config config/database.json -e test` to migrate test db
- to start app run `docker-compose up app`
- to start app in debug mode run `docker-compose up debug_app`


## Api

There are postman collection in repository you can import it for a faster start with API.
- By default collection variable `base_url` is set to `localhost:9000` if using other port or kubernetes do not forget to change the following variable
