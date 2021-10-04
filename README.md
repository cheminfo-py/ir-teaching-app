# IR teaching app 

<h3 align="center">


<img src="TOC.png" width="500" alt="Banner" />

<p> This repository allows deploying our IR teaching app which is a combination of our <a href="https://github.com/cheminfo-py/xtbservice">web service </a> and a frontend developed in the <a href="https://github.com/NPellet/visualizer">visualizer library</a>.</p>
</h3>

 


## Deploying the app 

You need to specify the port you want to use for frontend and the REST-API backend using the `IR_NGINX_PORT` environment variable. 
If you want to directly expose via HTTP, you can set the `IR_NGINX_PORT` to `80`, for HTTPS you need to add SSL certificates (which you can get, for example, from [letsencrypt](https://letsencrypt.org/d)) and use port `443`.

Most conveniently, first clone the repo
```bash
git clone https://github.com/cheminfo-py/ir-teaching-app
```

Then start the [docker-compose](https://docs.docker.com/compose/install/). 

```
docker-compose up --build -d
```

## Updating the app (admins only)
To update the dependencies (which is normally not needed), run `bash update_visualizer.sh` from the root level of this repository. 
If you find some issues in the installation this is the first thing to fix. 

## Admin notes 

The ngnix configuration has the following features: 

- it proxies the requests to `lib`, `github`, and `docs` to the corresponding routes on `lactame`
- it caches requests 

However, it uses a local version of the visualizer.

### Updated the curated sets of molecules
To edit the `view.json` (e.g., to add new collections of molecules) you can use [my.cheminfo.org](https://my.cheminfo.org/). 
There with right click you have the paste view/copy view options. If you use a custom `view.json` you need to have it in the root of the argument and provide `view.json` as argument 

```bash
bash update_visualizer.sh view.json
```
 
If you think you have an interesting series for the public deployment. [Contact us](kjablonka.com).