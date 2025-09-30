import styled from "styled-components";

export const LoadingState = styled.div`
    text-align: center;
    font-family: arial;
    padding: 3rem;
    color: #808080ff;
    font-size: 1.1rem;

    &::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f302;
        border-top: 2px solid #ff0000ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 0.5rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;