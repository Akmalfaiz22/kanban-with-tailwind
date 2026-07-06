class ApiResponse {
    constructor(statusCode, message, date = "success"){
        this.statusCode = statusCode
        this.message = message
        this.date = date 
        this.success = statusCode < 400
    }
}
export { ApiResponse }