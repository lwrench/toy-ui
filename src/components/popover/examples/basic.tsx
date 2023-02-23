import * as React from 'react';
import { Popover } from '@lwrench/toy-ui';

export default function App() {
  return (
    <div>
      <Popover preferredPosition="bottom-center">
        <Popover.Trigger>
          <button>show popover</button>
        </Popover.Trigger>
        <Popover.Content>
          <input type="text" />
          <Popover.Close>
            <button>close</button>
          </Popover.Close>

          <Popover preferredPosition="bottom-center">
            <Popover.Trigger>
              <button>show popover</button>
            </Popover.Trigger>
            <Popover.Content>
              <input type="text" />
              <Popover.Close>
                <button>close</button>
              </Popover.Close>
            </Popover.Content>
          </Popover>
        </Popover.Content>
      </Popover>

      <Popover preferredPosition="bottom-center">
        <Popover.Trigger>
          <button>show popover</button>
        </Popover.Trigger>
        <Popover.Content>
          <input type="text" />
          <Popover.Close>
            <button>close</button>
          </Popover.Close>
        </Popover.Content>
      </Popover>
    </div>
  );
}
