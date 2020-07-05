export declare enum ExtraOptions {
    HTTP_TIMEOUT = "HTTP_TIMEOUT",
    MAX_RETRIES = "MAX_RETRIES",
    SUCCEED_ON_FUNCTION_FAILURE = "SUCCEED_ON_FUNCTION_FAILURE"
}
export declare enum Credentials {
    AWS_ACCESS_KEY_ID = "AWS_ACCESS_KEY_ID",
    AWS_SECRET_ACCESS_KEY = "AWS_SECRET_ACCESS_KEY",
    AWS_SESSION_TOKEN = "AWS_SESSION_TOKEN"
}
export declare enum Props {
    FunctionName = "FunctionName",
    InvocationType = "InvocationType",
    LogType = "LogType",
    ClientContext = "ClientContext",
    Payload = "Payload",
    Qualifier = "Qualifier"
}
export declare const main: () => Promise<void>;
