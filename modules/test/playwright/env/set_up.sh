#!/bin/bash

set -e -x

source ${PLAYWRIGHT_BASE_DIR}/env/common.sh

export FARO_URL=http://localhost:8081

export PORTAL_URL=http://"$(hostname  -I | cut -f1 -d' ')":8080

update_portal_ext_properties

start_app_server

deploy_project_osgi_modules

deploy_project_env_deploy_folder

deploy_project_client_extensions

start_ac