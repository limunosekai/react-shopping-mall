import React, { useState } from 'react';
import { Collapse, Radio } from 'antd';

const { Panel } = Collapse;

function RadioBox(props) {
  const [value, setValue] = useState(0);

  const renderRadioBox = () =>
    props.list &&
    props.list.map((list) => (
      <Radio key={list._id} value={list._id}>
        {list.name}
      </Radio>
    ));

  const handleChange = (e) => {
    setValue(e.target.value);
    props.handleFilters(e.target.value);
  };

  return (
    <div>
      <Collapse defaultActiveKey={['0']}>
        <Panel header='가격 범위' key='1'>
          <Radio.Group onChange={handleChange} value={value}>
            {renderRadioBox()}
          </Radio.Group>
        </Panel>
      </Collapse>
    </div>
  );
}

export default RadioBox;
