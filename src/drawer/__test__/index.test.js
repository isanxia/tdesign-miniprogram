import simulate from 'miniprogram-simulate';
import path from 'path';

describe('drawer', () => {
  const drawer = simulate.load(path.resolve(__dirname, `../drawer`), {
    less: true,
  });

  describe('props', () => {
    it(`: visible`, () => {
      const id = simulate.load({
        template: `<t-drawer
          class="base"
          visible="{{visible}}"
        ></t-drawer>`,
        data: {
          visible: false,
        },
        methods: {},
        usingComponents: {
          't-drawer': drawer,
        },
      });

      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));
      // visible = false, t-popup不存在
      const popup = comp.querySelector('.base >>> .t-popup');
      expect(popup).toBeUndefined();
    });

    it(`: placement`, () => {
      const id = simulate.load({
        template: `<t-drawer
          class="base"
          visible="{{visible}}"
          placement="{{placement}}"
        ></t-drawer>`,
        data: {
          visible: true,
          placement: 'left',
        },
        methods: {},
        usingComponents: {
          't-drawer': drawer,
        },
      });

      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));

      const popup = comp.querySelector('.base >>> .t-popup');
      expect(popup.dom.getAttribute('class').includes('t-popup--left')).toBeTruthy();
    });

    it(`: z-index`, () => {
      const id = simulate.load({
        template: `<t-drawer
          class="base"
          visible="{{visible}}"
          zIndex="{{zIndex}}"
        ></t-drawer>`,
        data: {
          visible: true,
          zIndex: 99,
        },
        methods: {},
        usingComponents: {
          't-drawer': drawer,
        },
      });

      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));
      const popup = comp.querySelector('.base >>> .t-popup');
      expect(popup.dom.getAttribute('style').includes('z-index:99')).toBeTruthy();
    });
  });

  describe('event', () => {
    const overlayClick = jest.fn();
    let clickItemValue;
    const itemClick = (e) => {
      const { sibarItem } = e.detail;
      clickItemValue = sibarItem;
    };

    it(`: mutiple`, async () => {
      const id = simulate.load({
        template: `
        <t-drawer
          class="base"
          visible="{{visible}}"
          showOverlay="{{showOverlay}}"
          items="{{sidebar}}"
          bind:overlay-click="overlayClick"
          bind:item-click="itemClick"
        ></t-drawer>
        `,
        data: {
          showOverlay: false,
          visible: true,
          sidebar: [
            {
              title: '菜单一',
            },
            {
              title: '菜单二',
            },
          ],
        },
        methods: {
          overlayClick,
          itemClick,
        },
        usingComponents: {
          't-drawer': drawer,
        },
      });

      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));

      // showOverlay为false
      expect(comp.querySelector('.base >>> #popup-overlay')).toBeUndefined();

      const popup = comp.querySelector('.base >>> .t-popup');
      popup.dispatchEvent('visible-change');
      await simulate.sleep(10);
      expect(overlayClick).toHaveBeenCalledTimes(0);

      // showOverlay为 true， overlayClick 事件执行
      comp.setData({
        visible: true,
        showOverlay: true,
      });
      const $popupOverlay = comp.querySelector('.base >>> #popup-overlay');

      $popupOverlay.dispatchEvent('tap');
      await simulate.sleep(0);
      expect(overlayClick).toHaveBeenCalledTimes(1);

      const items = comp.querySelectorAll('.base >>> .t-drawer__sidebar-item');
      expect(items.length).toBe(comp.data.sidebar.length);
      const index = 1;
      items[index].dispatchEvent('tap');
      await simulate.sleep(10);
      expect(clickItemValue.item).toEqual(comp.data.sidebar[index]);
    });
  });
});
