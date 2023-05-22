# tomato-disease-detector-application


pm2 start main.py --interpreter=python3


K8S
restart 
kubectl rollout restart deployment tomato -n tomato

---
<br />

# Tomato App's Kubenetes installation guild

## Part 0: Introduction
- installation guild has not completed yet.
- this part maybe helping IT KMITL 18++ (รุ่นน้อนๆ) in final project(final project is no need) or everybody who need to starting k8s...
- this repository deploying api server(go) in GKE
- images to storage is using GCS
- k8s yaml is inside folder /k8s
- convert your env values into configmap (for deploying part) | (tmt-k8s-config.yaml) <- (it was hide)
- you can try this on GCP free trial (3 month)

---
<br />

## Part 1: Docker Images
 > build image from some where (this repo build in local macbook)

 > firstly u need to register dockerhub

    ```
    docker login -u $DOCKER_USERNAME
    docker build -t tomato/api:latest . 
    docker tag tomato/api:latest $DOCKER_USERNAME/tomato-api
    ```



> push to docker hub (on this repo will be publish)

    docker push $DOCKER_USERNAME/tomato



---
<br />

## Part 1.2: Build image on Kube:
#### if you dont lazy to add file in .gitignore or other credentials file into kube again

> generate rsa ssh
    ```
    ssh-keygen -t rsa

    cd ~/.ssh

    cat ssh_rsa.pub
    ```

> add kube ssh into github or other

> git clone on kube

> build and deploy

    ```
    docker build -t tomato/api:latest . 
    docker tag tomato-api:latest asia.gcr.io/lunar-works-371407/tomato-api
	docker push asia.gcr.io/lunar-works-371407/tomato-api
    ```

    or

    
---
<br />


## Part 2: GKE starter

### First meet
---
> welcome message that mean u can't do everything

    The connection to the server localhost:8080 was refused - did you specify the right host or port?

> you need to setup k8s config
    ```
    gcloud container clusters get-credentials <K8S_CLUSTER_NAME> --project <PROJECT_ID> --zone <K8S_ZONE>
    ```

    ```
    gcloud container clusters get-credentials tomato-k8s --project lunar-works-371407 --zone asia-southeast1
    ```

> where do i find above values?
- K8S_CLUSTER_NAME is cluster name that u create k8s
- PROJECT_ID is GCP project id
- K8S_ZONE is zone that u select when created 

you can find them in Google Console/Kubenetes Engine/Clusters/$CLUSTER_NAME

    ```
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    ```
    
    ```
    helm repo update
    ```

    ```
    helm install ingress-nginx ingress-nginx/ingress-nginx --namespace kube-system
    ```

> for autopilot (dont touch it)
> install nginx-ingress

     ```
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.34.1/deploy/static/provider/cloud/deploy.yaml
    ```

> Ingress pod

    ```
    kubectl get pods --all-namespaces -l app.kubernetes.io/name=ingress-nginx
    ```

> Check ingress controller ingo

    ```
    kubectl get services ingress-nginx-controller --namespace=ingress-nginx
    ```


## Part 3: k8s Images Install
> pull image from docker hub

    ```
    docker pull kaowasabi/tomato-api:latest
    ```

> push install GCR (it's like docker hub)

    ```
	docker tag kaowasabi/tomato-api:latest asia.gcr.io/lunar-works-371407/tomato-api
    
	docker push asia.gcr.io/lunar-works-371407/tomato-api
    ```

---

<br />

## Part 4: k8s Deployment
### Create namespace

> create namespace

    ```
    kubectl create namespaces tomato-api
    ```

> show created namespace

    ```
    kubectl get namespace tomato-api
    ```

> teleport to name space

    ```
    kubectl config set-context $(kubectl config current-context) --namespace=tomato-api-ns
    ```

---
### ยาแมว

#### you can view .yaml inside folder /k8s

> make folder for first services

    ```
    mkdir api-k8s
    ```

    ```
    touch deployment.yaml
    touch service.yaml
    touch ingress.yaml
    touch config.yaml (.env values is here)
    ```

> Create Configmap

    ```
    kubectl create -f ./api-k8s/config.yaml
    ```

> Check all configmap in namespace 

    ```
    kubectl get configmap
    ```

> > if you not found your configmap (that mean you are not in this namespace)

    ```
    kubectl get configmap -n tomato-api-ns
    ```


> View Configmap

    ```
    kubectl get configmap api-config -o yaml
    ```

---

> Deployment

    ```
    kubectl apply -f ./api-k8s/deployment.yaml
    kubectl apply -f ./api-k8s/service.yaml
    kubectl apply -f ./api-k8s/ingress.yaml
    ```
    
    
    
 ---
 ## Application Structure Overview
 <img width="1379" alt="overview" src="https://user-images.githubusercontent.com/1614727/234761266-fc7f6699-760a-41a8-8c01-c292a185fefe.png">

 ## Hexagonal Architecture
 <img width="1362" alt="hexagonal" src="https://user-images.githubusercontent.com/1614727/229361947-ed5092d2-9df2-4779-95ef-7e6b2b9ea3ce.png">

## Infrastructure
<img width="1362" alt="infra" src="https://user-images.githubusercontent.com/1614727/234762128-9a97701e-db50-45bb-a1f5-821d5901c517.png">


 
