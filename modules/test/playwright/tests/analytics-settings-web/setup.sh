#!/bin/bash

set -e -x

export FARO_URL=http://localhost:8081

export PORTAL_URL=http://"$(hostname  -I | cut -f1 -d' ')":8080

source ${PLAYWRIGHT_BASE_DIR}/env/common.sh

update_portal_ext_properties

start_app_server

start_ac