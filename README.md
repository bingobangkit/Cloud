## Go-Bin Web
# Cloud Team
1. Fandi Syamsudin C0040345
2. Rizca Kurnia Dewi C2112058

## Cloud Implementation on Web App
# Link Web App
1. Deploy on Google Kubernetes Engine http://34.101.165.64
2. Deploy on Streamlit.io https://share.streamlit.io/fandisyamsudin/gobinweb/app.py

# Demo 
https://www.youtube.com/watch?v=2Qdz39IW5iI

#  Build the Web App
1. Deploy model on Google AI Platfrom
![Screenshot_1](https://user-images.githubusercontent.com/54672242/121008582-585a6e80-c7bd-11eb-8063-b848ed1d1f78.jpg)

2. Access the model using endpoint (you should have credential.json from service account)
https://asia-southeast1-ml.googleapis.com/v1/projects/go-bin-capstone/models/fandi_efficientnet_model:predict?alt=json

# Deploy The Web App on Google Kubernetes Engine
![Screenshot_4](https://user-images.githubusercontent.com/54672242/121013509-1af8df80-c7c3-11eb-953a-f14ae63dc8ac.jpg)

1. Create the docker image
// set project id
export PROJECT_ID=go-bin-capstone

// Build the docker image
docker build -t gcr.io/${PROJECT_ID}/gobin-web:v1 .

// Check the docker image
docker images

// Authenticate to Container Registry
gcloud auth configure-docker

// Upload the docker image to Google Container Registry
docker push gcr.io/${PROJECT_ID}/gobin-web:v1

2. Create Kubernetes Cluster
// set project id
gcloud config set project $PROJECT_ID 

// set zone
gcloud config set compute/zone asia-southeast2

// Create cluster
gcloud container clusters create gobin-web-cluster --num-nodes=2
![Screenshot_2](https://user-images.githubusercontent.com/54672242/121010756-00713700-c7c0-11eb-8918-7064ef46b611.jpg)

3. Deploy the Web App on Google Kubernetes Engine
// Deploy the Web App
kubectl create deployment gobin-web --image=gcr.io/${PROJECT_ID}/gobin-web:v1

//Expose the Web App
kubectl expose deployment gobin-web --type=LoadBalancer --port 80 --target-port 8501

// Check the services
kubectl get service
![Screenshot_3](https://user-images.githubusercontent.com/54672242/121011270-9f962e80-c7c0-11eb-974d-d3cdd17733c9.jpg)

## Cloud Implementation on Android App
![Screenshot_5](https://user-images.githubusercontent.com/54672242/121013869-9490cd80-c7c3-11eb-89c0-5afe09dd1152.jpg)

![Screenshot_6](https://user-images.githubusercontent.com/54672242/121014314-0a953480-c7c4-11eb-9894-9f0e2a548d92.jpg)
![Screenshot_7](https://user-images.githubusercontent.com/54672242/121014326-0cf78e80-c7c4-11eb-8da8-bf60ceed3917.jpg)
![Screenshot_8](https://user-images.githubusercontent.com/54672242/121014327-0d902500-c7c4-11eb-8cf9-a8477c40df20.jpg)
![Screenshot_9](https://user-images.githubusercontent.com/54672242/121014329-0e28bb80-c7c4-11eb-9e7e-e91ee1925380.jpg)

## Thank You !!!