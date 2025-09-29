import styled from "styled-components";

export const Container = styled.div`
  padding: 1rem;
  min-height: 100vh;
  background-color: #1f1f1fff;
  align-items: center;
  display: flex;
  flex-direction: column;
  font-family: arial;
`;

export const Title = styled.h1`
    font-size: 2rem;
    color: #e7e7e7ff;
    margin-bottom: 0.5rem;
    text-align: center;
`;

export const TopLine = styled.div`
    width: 60px;
    height: 3px;
    background-color: #ff0000ff;
    margin: 0 auto 1.5rem;
    border-radius: 2px;
`;

export const MonthsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const MonthTitle = styled.h2`
    font-size: 1.2rem;
    color: #e7e7e7ff;
    margin: 1rem 0 0.5rem;
    font-weight: 600;
`;

export const MonthCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    background: #bebebeff;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
    }

    svg {
        color: #ff0000ff;
        flex-shrink: 0;
    }

    span {
        font-size: 1.1rem;
        font-weight: 500;
        color: #333;
    }
`;

export const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow:
                0 25px 45px rgba(0, 0, 0, 0.1),
                0 10px 20px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1);
    padding: 0.75rem 1.5rem;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    color: #e7e7e7ff;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    justify-content: center;

    &:hover {
        background: #f8f9fa;
        border-color: #007bff;
        color: #007bff;
    }

    svg {
        font-size: 1.2rem;
    }
`;

export const TableContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const LoadingState = styled.div`
    text-align: center;
    padding: 3rem 1rem;
    color: #666;
    font-size: 1rem;
    background: white;
    border-radius: 12px;
`;

export const ErrorState = styled.div`
    text-align: center;
    padding: 2rem 1rem;
    color: #dc3545;
    font-size: 1rem;
    background: #fff5f5;
    border: 1px solid #ffcdd2;
    border-radius: 12px;
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 3rem 1rem;
    color: #999;
    font-size: 1rem;
    background: white;
    border-radius: 12px;
`;

export const ChamadaCard = styled.div`
    background: #bebebeff;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const ChamadaInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

export const ChamadaLabel = styled.span`
    font-size: 0.85rem;
    color: #666;
    font-weight: 500;
    display: block;
    margin-bottom: 0.25rem;
`;

export const ChamadaValue = styled.span`
    font-size: 1rem;
    color: #333;
    font-weight: 600;
    display: block;
`;

export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: #ff0000ff;
    color: white;
    border: 2px solid #ff0000ff;
    border-radius: 8px;
    padding: 0.875rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #b30000ff;
    }

    &:active {
        transform: scale(0.98);
    }

    svg {
        font-size: 1.25rem;
    }
`;