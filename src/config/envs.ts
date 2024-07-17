
import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars{
    PORT: number;
    IMPLEMENTOS_MICROSERVICE_HOST:string
    IMPLEMENTOS_MICROSERVICE_PORT:number
    ESPACIOS_MICROSERVICE_HOST:string
    ESPACIOS_MICROSERVICE_PORT:number
    GATEWAY_HOST:string
    GATEWAY_PORT:number
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    IMPLEMENTOS_MICROSERVICE_HOST: joi.string().required(),
    IMPLEMENTOS_MICROSERVICE_PORT: joi.number().required(),
    ESPACIOS_MICROSERVICE_HOST: joi.string().required(),
    ESPACIOS_MICROSERVICE_PORT: joi.number().required(),
    GATEWAY_HOST: joi.string().required(),
    GATEWAY_PORT: joi.number().required(),
})
.unknown(true)

const {error, value} = envsSchema.validate(process.env)
if(error){
    throw new Error(`Config validation error: ${error.message}`)
}
const envVars: EnvVars = value

export const envs = {
    port: envVars.PORT,
    implementosMicroserviceHost: envVars.IMPLEMENTOS_MICROSERVICE_HOST,
    implementosMicroservicePort: envVars.IMPLEMENTOS_MICROSERVICE_PORT,
    espaciosMicroserviceHost: envVars.ESPACIOS_MICROSERVICE_HOST,
    espaciosMicroservicePort: envVars.ESPACIOS_MICROSERVICE_PORT,
    gatewayHost: envVars.GATEWAY_HOST,
    gatewayPort: envVars.GATEWAY_PORT,
}

