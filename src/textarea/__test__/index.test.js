import simulate from 'miniprogram-simulate';
import path from 'path';

describe('textarea', () => {
  const textarea = simulate.load(path.resolve(__dirname, `../textarea`), 't-textarea', {
    less: true,
    rootPath: path.resolve(__dirname, '../..'),
  });

  describe('props', () => {
    it(': label', () => {
      const id = simulate.load({
        template: `<t-textarea
        class="base"
        value="{{value}}"
        label="{{label}}"
        ></t-textarea>`,
        data: {
          value: 'textarea content',
          label: '标签文字',
        },
        usingComponents: {
          't-textarea': textarea,
        },
      });
      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));
      const component = comp.querySelector('.base');

      const $label = comp.querySelector('.base >>> .t-textarea__name');
      expect($label).toBeDefined();
      expect($label.dom.textContent).toBe(component.instance.data.label);
    });

    it(': maxcharacter', async () => {
      const handleChange = jest.fn();
      const id = simulate.load({
        template: `<t-textarea
        class="base"
        maxcharacter="{{maxcharacter}}"
        value="{{value}}"
        bind:change="handleChange"
        >
        </t-textarea>`,
        data: {
          maxcharacter: 10,
          value: 'tdesign',
        },
        methods: {
          handleChange,
        },
        usingComponents: {
          't-textarea': textarea,
        },
      });
      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));
      const component = comp.querySelector('.base');
      expect(component.instance.data.count).toBe(7);

      const $textarea = comp.querySelector('.base >>> .t-textarea__wrapper-textarea');

      $textarea.dispatchEvent('input', { detail: { value: 'tdesign123' } });
      await simulate.sleep(0);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(component.instance.data.count).toBe(10);

      $textarea.dispatchEvent('input', { detail: { value: 'textarea用于多行文本信息输入' } });
      await simulate.sleep(0);
      expect(handleChange).toHaveBeenCalledTimes(2);
      expect(component.instance.data.count).toBe(10);
      expect(handleChange.mock.calls[1][0].detail).toStrictEqual({
        value: 'textarea用于多行文本信息输入',
      });

      $textarea.dispatchEvent('textarea', { detail: { value: 'textarea用于567' } });
      await simulate.sleep(0);
      expect(component.instance.data.count).toBe(10);
    });
  });

  describe('slots', () => {
    it(': label', () => {
      const id = simulate.load({
        template: `
        <t-textarea class="base">
          <text slot="label">标签文字</text>
        </t-textarea>`,
        usingComponents: {
          't-textarea': textarea,
        },
      });
      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));
      const component = comp.querySelector('.base');
      expect(component).toMatchSnapshot();

      const $label = comp.querySelector('.base >>> .t-textarea__name');
      expect($label.dom.textContent).toBe('标签文字');
      //
    });
  });

  describe('event', () => {
    it(': line-change', async () => {
      const handleLineChange = jest.fn();
      const id = simulate.load({
        template: `<t-textarea
        class="base"
        maxcharacter="{{maxcharacter}}"
        value="{{value}}"
        bind:lineChange="handleLineChange"
        >
        </t-textarea>`,
        data: {
          maxcharacter: 10,
          value: 'tdesign',
        },
        methods: {
          handleLineChange,
        },
        usingComponents: {
          't-textarea': textarea,
        },
      });
      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));
      const component = comp.querySelector('.base');
      expect(component.instance.data.count).toBe(7);

      const $textarea = comp.querySelector('.base >>> .t-textarea__wrapper-textarea');

      $textarea.dispatchEvent('linechange', {
        detail: {
          value: '指定光标与键盘的距离。取textarea距离底部的距离和cursor-spacing指定的距离的最小值作为光标与键盘的距离',
        },
      });
      await simulate.sleep(0);
      expect(handleLineChange).toHaveBeenCalledTimes(1);
      expect(handleLineChange.mock.calls[0][0].detail).toStrictEqual({
        value: '指定光标与键盘的距离。取textarea距离底部的距离和cursor-spacing指定的距离的最小值作为光标与键盘的距离',
      });
      // expect(component.instance.data.count).toBe(10);
    });
  });
});
