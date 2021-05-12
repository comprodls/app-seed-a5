#!/bin/sh

if [ -z "${SSM_PREFIX}" ]; then
  SSM_PREFIX=/engage/setup
fi

echo SSM PREFIX... ${SSM_PREFIX}

## Get Secrets from SSM and override ENVIRONMENT. In production we dont expect these environment
## to have been set in task def.

#Get the Region information needed to call the AWS SSM CLI - This method of fetching AWS Region is specific to the EC2 type services in an ECS cluster.
#EC2_AVAIL_ZONE=`curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone`
#EC2_REGION="`echo \"$EC2_AVAIL_ZONE\" | sed -e 's:\([0-9][0-9]*\)[a-z]*\$:\\1:'`"

# This method of fetching AWS Region is specific to the FARGATE type services in an ECS cluster.
EC2_REGION=${AWS_REGION}
echo aws region... ${EC2_REGION}

# EC2 scenario where AWS_REGION variable is not available.
if [ -z "${AWS_REGION}" ]; then
  echo aws region not found or null... falling back to EC2 approach...
  EC2_AVAIL_ZONE=`curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone`
  EC2_REGION="`echo \"$EC2_AVAIL_ZONE\" | sed -e 's:\([0-9][0-9]*\)[a-z]*\$:\\1:'`"
fi

# EC2 scenario where an existing service is being deployed (Overriding AWS_REGION = INJECT_SSM_GLOBAL).
if [ "$AWS_REGION" = "INJECT_SSM_GLOBAL" ]; then
  echo aws region... ${AWS_REGION}... falling back to EC2 approach...
  EC2_AVAIL_ZONE=`curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone`
  EC2_REGION="`echo \"$EC2_AVAIL_ZONE\" | sed -e 's:\([0-9][0-9]*\)[a-z]*\$:\\1:'`"
fi

# echo AWS_REGION to log the final region being set
echo aws region... ${EC2_REGION}

PARAMETERS_G=`aws ssm get-parameters-by-path --path "${SSM_PREFIX}/G" --with-decryption --region $EC2_REGION`
PARAMETERS_APP=`aws ssm get-parameters-by-path --path "${SSM_PREFIX}/APP" --with-decryption --region $EC2_REGION`

# Process Global params
for row in $(echo ${PARAMETERS_G} | jq -c '.Parameters' | jq -c '.[]'); do
    KEY=$(basename $(echo ${row} | jq -c '.Name'))
    VALUE=$(echo ${row} | jq -c '.Value')

    KEY=`echo ${KEY} | tr -d '"'`
    VALUE=`echo ${VALUE} | tr -d '"'`

    export ${KEY}=${VALUE}
    echo Adding env... ${KEY}
done

# Process Microservices params
for row in $(echo ${PARAMETERS_APP} | jq -c '.Parameters' | jq -c '.[]'); do
    KEY=$(basename $(echo ${row} | jq -c '.Name'))
    VALUE=$(echo ${row} | jq -c '.Value')

    KEY=`echo ${KEY} | tr -d '"'`
    VALUE=`echo ${VALUE} | tr -d '"'`

    export ${KEY}=${VALUE}
    echo Adding env... ${KEY}
done

# Start Nodejs with container start up script
exec node ${STARTUP}