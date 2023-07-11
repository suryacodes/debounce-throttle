import React, { useCallback, useEffect, useState } from 'react';
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
  const [isThrottled, setIsThrottled] = useState(false);

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

  // Limit the frequency of function & Api calls etc.

  /**
   * Debounce - If the function is called multiple times at
   * specified interval, only the  last invocation is
   * executed , and previous invocations within the interval
   * are ignored
   */
  const debounce = useCallback(
    (fn: (...args) => void, delay = 1000): Function => {
      let timeoutId = null;
      return (...args) => {
        clearTimeout(timeoutId!);
        timeoutId = setTimeout(() => {
          fn(...args);
        }, delay);
      };
    },
    []
  );

  /**
   * Throttle - If the function is called multiple times
   * only the the first invocation is executed , and
   * subsequent invocations are ignored until the
   * interval expires
   */
  const throttle = useCallback(
    (fn: (...args) => void, delay = 3000): Function => {
      return (...args: any[]) => {
        if (isThrottled) {
          return;
        }
        setIsThrottled(true);
        fn(...args);

        setTimeout(() => {
          setIsThrottled(false);
        }, delay);
      };
    },
    [isThrottled]
  );

  const onChange = throttle((searchText: string) => {
    const sanitizedSearchText = searchText.trim().toLowerCase();
    if (!sanitizedSearchText) {
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
      <Input onChange={(e) => e?.target?.value && onChange(e.target.value)} />
      {result.map((e) => {
        return <p>{e.title}</p>;
      })}
    </Container>
  );
};

export default App;
