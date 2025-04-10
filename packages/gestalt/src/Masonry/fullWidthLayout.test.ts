import fullWidthLayout from './fullWidthLayout';
import MeasurementStore from './MeasurementStore';
import { Position } from './types';

type Item = {
  name: string;
  height: number;
  color?: string;
  columnSpan?: number;
};

const getColumnSpanConfig = (item: Item) => item.columnSpan ?? 1;

describe.each([undefined, getColumnSpanConfig])(
  'full width layout tests',
  (_getColumnSpanConfig) => {
    test('sets correct width and center offset when positioning', () => {
      const measurementStore = new MeasurementStore<Record<any, any>, number>();
      const positionCache = new MeasurementStore<Record<any, any>, Position>();
      const items: ReadonlyArray<Item> = [
        { 'name': 'Pin 0', 'height': 100 },
        { 'name': 'Pin 1', 'height': 120 },
        { 'name': 'Pin 2', 'height': 80 },
        { 'name': 'Pin 3', 'height': 100 },
      ];
      items.forEach((item: any) => {
        measurementStore.set(item, item.height);
      });

      const layout = fullWidthLayout({
        measurementCache: measurementStore,
        positionCache,
        gutter: 10,
        layout: 'flexible',
        idealColumnWidth: 240,
        minCols: 2,
        width: 1000,
        originalItems: items,
        _getColumnSpanConfig,
      });
      expect(layout(items)).toEqual([
        { top: 0, height: 100, left: 5, width: 240 },
        { top: 0, height: 120, left: 255, width: 240 },
        { top: 0, height: 80, left: 505, width: 240 },
        { top: 0, height: 100, left: 755, width: 240 },
      ]);
    });

    test('sets correct height gutter', () => {
      const measurementStore = new MeasurementStore<Record<any, any>, number>();
      const positionCache = new MeasurementStore<Record<any, any>, Position>();
      const items: ReadonlyArray<Item> = [
        { 'name': 'Pin 0', 'height': 100 },
        { 'name': 'Pin 1', 'height': 120 },
        { 'name': 'Pin 2', 'height': 80 },
        { 'name': 'Pin 3', 'height': 100 },
        { 'name': 'Pin 4', 'height': 100 },
        { 'name': 'Pin 5', 'height': 120 },
        { 'name': 'Pin 6', 'height': 80 },
        { 'name': 'Pin 7', 'height': 100 },
      ];
      items.forEach((item: any) => {
        measurementStore.set(item, item.height);
      });

      const layout = fullWidthLayout({
        measurementCache: measurementStore,
        positionCache,
        gutter: 10,
        layout: 'flexible',
        idealColumnWidth: 240,
        minCols: 2,
        width: 1000,
        originalItems: items,
        _getColumnSpanConfig,
      });
      expect(
        layout(items)
          .slice(4)
          .map((position) => position.top),
      ).toEqual([90, 110, 110, 130]);
    });

    test('correctly positions items with no height', () => {
      const measurementStore = new MeasurementStore<Record<any, any>, number>();
      const positionCache = new MeasurementStore<Record<any, any>, Position>();
      const items: ReadonlyArray<Item> = [
        { 'name': 'Pin 0', 'height': 100 },
        { 'name': 'Pin 1', 'height': 120 },
        { 'name': 'Pin 2', 'height': 0 },
        { 'name': 'Pin 3', 'height': 100 },
        { 'name': 'Pin 4', 'height': 100 },
        { 'name': 'Pin 5', 'height': 120 },
        { 'name': 'Pin 6', 'height': 80 },
        { 'name': 'Pin 7', 'height': 100 },
      ];
      items.forEach((item: any) => {
        measurementStore.set(item, item.height);
      });

      const layout = fullWidthLayout({
        measurementCache: measurementStore,
        positionCache,
        gutter: 10,
        layout: 'flexible',
        idealColumnWidth: 240,
        minCols: 2,
        width: 1000,
        originalItems: items,
        _getColumnSpanConfig,
      });

      const positions = layout(items);
      const pin2Position = positions[2];
      const pin3Position = positions[3];

      expect(pin2Position?.height).toBe(0);
      expect(pin2Position?.top).toBe(0);
      expect(pin3Position?.top).toBe(0);
      expect(pin2Position?.left).toBe(pin3Position?.left);
    });
  },
);
