# ir-teaching-app
This repository allows deploying our IR teaching app which is a combination of our [web service](https://github.com/cheminfo-py/xtbservice) and a frontend developed in the [visualizer library](https://github.com/NPellet/visualizer). 


## Deploying the app 

You need to specify the ports you want to use for frontend and the REST-API backend using the `NGNIX_PORT` and the `BACKEND_PORT` environment variables. 
If you want to directly expose via HTTP, you can set the `NGNIX_PORT` to `80`, for HTTPS you need to add SSL certificates and use port `443`.

```
docker-compose up --build -d
```

To update the dependencies (which is normally not needed), run `bash update_visualizer.sh`. Note that the `VHCOMMIT` variable must coincide with the commit set in the view.

## Citation 
If you find this app useful, please cite 
