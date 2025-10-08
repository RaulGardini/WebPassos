import styled from "styled-components";

export const LoadingState = styled.div`
    text-align: center;
    font-family: arial;
    padding: 3rem;
    color: #808080ff;
    font-size: 1.1rem;
    position: relative;
    padding-top: 5rem;

    &::before {
        content: '';
        position: absolute;
        top: 3rem;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid #f3f3f320;
        border-top: 3px solid #ff0000ff;
        border-right: 3px solid #ff0000ff;
        animation: spin 1s linear infinite;
    }

    &::after {
        content: '';
        position: absolute;
        top: calc(3rem + 6px);
        left: 50%;
        transform: translateX(-50%);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-bottom: 3px solid #ff6666ff;
        border-left: 3px solid #ff6666ff;
        animation: spin 1.5s linear infinite reverse;
    }

    @keyframes spin {
        0% { transform: translateX(-50%) rotate(0deg); }
        100% { transform: translateX(-50%) rotate(360deg); }
    }
`;