export type Styles = {
    'message-management-container': string;
    'search-box': string;
    'search-input': string;
    'content-column': string;
    'content-username': string;
    'wrap-content': string;
    'user-avatar': string;
    username: string;
    content: string;
    'project-name': string;
    'task-name': string;
    state: string;
    redo: string;
    done: string;
    pagination: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
