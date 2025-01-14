interface DefaultResponse {

    id?: string;
}

interface SystemType extends DefaultResponse {

    createdDate?: Date,
    modifiedDate?: Date,
    code?: string,
    name?: string,
    value?: string,
    description?: string

}
