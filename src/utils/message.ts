export enum ERROR_MESSAGES {
    NETWORK_ERROR = "Network Error",
    SERVER_ERROR = "Server Error",
    PROFILE_FETCH = "Failed to fetch profile information",
    SINGLE_PIN_FETCH = "Failed to fetch pin information",
    ALL_PIN_FETCH = "Failed to fetch pins",
    LIKE_PIN = "Failed to like pin",
    LOAD_IMAGE = "Failed to load image",
    UNLIKE_PIN = "Failed to unlike pin",
    ACTION = "Failed to perform action",
    ADD_COMMENT = "Failed to add a comment",
    DELETE_COMMENT = "Failed to delete comment",
    UPDATE_COMMENT = "Failed to update comment",
    REQUIRED_COMMENT_INPUT = "Comment cannot be empty"
}

export enum SUCCESS_MESSAGES {
    ADD_PIN = "Pin added successfully",
    LIKE_PIN = "Pin liked successfully",
    UNLIKE_PIN = "Pin unliked successfully",
    ADD_COMMENT = "Comment added successfully",
    DELETE_COMMENT = "Comment deleted successfully",
    UPDATE_COMMENT = "Comment updated successfully"
}