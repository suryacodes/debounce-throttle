import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  width: 300px;
  height: 20px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
`;

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [data, setData] = useState<Todo[]>([]);
  const [result, setResult] = useState<Todo[]>([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }, []);

  const debounce = <T extends any[]>(
    fn: (...args: T) => void,
    delay = 1000
  ) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: T) => {
      clearTimeout(timeoutId!);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const onChange = debounce((searchText: string) => {
    const sanitizedSearchText = searchText.trim().toLowerCase();
    if (sanitizedSearchText.length < 2) {
      setResult([]);
      return;
    }
    const filteredData = data.filter((e) =>
      e.title.toLowerCase().startsWith(searchText.toLowerCase())
    );
    setResult(filteredData);
  });

  return (
    <Container>
      <h1>Search!</h1>
      <Input onChange={(e) => onChange(e.target.value)} />
      {result.map((e) => {
        return <p>{e.title}</p>;
      })}
    </Container>
  );
};

export default App;
