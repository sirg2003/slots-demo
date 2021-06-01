import reelSettings from './config';
const symbolBar = 0;
const symbol2xBar = 1;
const symbol3xBar = 2;
const symbolSeven = 3;
const symbolCherry = 4;
const SYMBOL_BAR = 0;
const SYMBOL_2xBAR = 1;
const SYMBOL_3xBAR = 2;
const SYMBOL_SEVEN = 3;
const SYMBOL_CHERRY = 4;

const SYMBOLS_FRAME = {
  [SYMBOL_BAR]: 'BAR',
  [symbol2xBar]: '2xBAR',
  [symbol3xBar]: '3xBAR',
  [symbolSeven]: '7',
  [symbolCherry]: 'Cherry',
};

const patternSymbolBar = `${SYMBOL_BAR}-${SYMBOL_BAR}-${SYMBOL_BAR}`;
const patternSymbol2xBar = `${SYMBOL_2xBAR}-${SYMBOL_2xBAR}-${SYMBOL_2xBAR}`;
const patternSymbol3xBar = `${SYMBOL_3xBAR}-${SYMBOL_3xBAR}-${SYMBOL_3xBAR}`;
const patternSeven = `${SYMBOL_SEVEN}-${SYMBOL_SEVEN}-${SYMBOL_SEVEN}`;
const patternCherry = `${SYMBOL_CHERRY}-${SYMBOL_CHERRY}-${SYMBOL_CHERRY}`;

const patternsWin = [
  {
    type: 'line',
    line: 0,
    symbol: SYMBOL_CHERRY,
    pattern: patternCherry,
    points: 2000,
    payTable: 'cherry-0',
  },
  {
    type: 'line',
    line: 1,
    symbol: SYMBOL_CHERRY,
    pattern: patternCherry,
    points: 1000,
    payTable: 'cherry-1',
  },
  {
    type: 'line',
    line: 2,
    symbol: SYMBOL_CHERRY,
    pattern: patternCherry,
    points: 4000,
    payTable: 'cherry-2',
  },
  {
    type: 'line',
    line: 'any',
    symbol: SYMBOL_SEVEN,
    pattern: patternSeven,
    points: 150,
    payTable: 'line-7',
  },
  {
    type: 'line',
    line: 'any',
    symbol: SYMBOL_BAR,
    pattern: patternSymbolBar,
    points: 10,
    payTable: 'line-bar-1',
  },
  {
    type: 'line',
    line: 'any',
    symbol: SYMBOL_2xBAR,
    pattern: patternSymbol2xBar,
    points: 20,
    payTable: 'line-bar-2',
  },
  {
    type: 'line',
    line: 'any',
    symbol: SYMBOL_3xBAR,
    pattern: patternSymbol3xBar,
    points: 50,
    payTable: 'line-bar-3',
  },
  {
    type: 'combo',
    patterns: [
      { value: `${SYMBOL_CHERRY}-${SYMBOL_SEVEN}-`, side: 'left', payTable: 'combo-7' },
      { value: `${SYMBOL_SEVEN}-${SYMBOL_CHERRY}-`, side: 'left', payTable: 'combo-7' },
      { value: `-${SYMBOL_CHERRY}-${SYMBOL_SEVEN}`, side: 'right', payTable: 'combo-7' },
      { value: `-${SYMBOL_SEVEN}-${SYMBOL_CHERRY}`, side: 'right', payTable: 'combo-7' },
    ],
    points: 75,
  },
  {
    type: 'combo-any',
    symbols: [SYMBOL_BAR, SYMBOL_2xBAR, SYMBOL_3xBAR],
    points: 5,
    payTable: 'combo-bar',
  },
];

const winLinesParams = [
  { id: 'line-left-0', position: 'left', index: 0 },
  { id: 'line-left-1', position: 'left', index: 1 },
  { id: 'line-left-2', position: 'left', index: 2 },
  { id: 'line-right-0', position: 'right', index: 0 },
  { id: 'line-right-1', position: 'right', index: 1 },
  { id: 'line-right-2', position: 'right', index: 2 },
  { id: 'line-center-0', position: 'center', index: 0 },
  { id: 'line-center-1', position: 'center', index: 1 },
  { id: 'line-center-2', position: 'center', index: 2 },
];
const SYMBOL_ID_EMPTY = -1;

const filterDuplicates = (symbol, index, symbols) => symbols.indexOf(symbol) === index;
const filterByLine = (pattern) => pattern.type === 'line';
const filterNotLine = (pattern) => pattern.type !== 'line';
const patternsEqualSymbols = patternsWin.filter(filterByLine);
const patternsNotEqualSymbols = patternsWin.filter(filterNotLine);

function checkPatternEqualSymbols(linePattern, lineIndex) {
  let winAmount = 0;
  let winLines = [];
  let payTable = [];
  patternsEqualSymbols.forEach((winPattern) => {
    const isValidPattern = linePattern === winPattern.pattern;
    const isValidLine = winPattern.line === 'any' || winPattern.line === lineIndex;
    if (isValidPattern && isValidLine) {
      // const winLineData = {
      //   type: winPattern.type,
      //   line: lineIndex,
      // };
      // winLines.push(winLineData);
      const winLine = 'line-center-' + lineIndex;
      winLines.push(winLine);
      winAmount += winPattern.points;
      payTable.push(winPattern.payTable);
    }
  });
  return { winAmount, winLines, payTable };
}
function checkPatternNotEqualSymbols(symbols, linePattern, lineIndex) {
  let winAmount = 0;
  let winLines = [];
  let payTable = [];
  patternsNotEqualSymbols.forEach((winPattern) => {
    const isCombo = winPattern.type === 'combo';
    const isComboAny = winPattern.type === 'combo-any';
    // console.log('[checkPatternNotEqualSymbols] isCombo:>> ', isCombo);
    // console.log('[checkPatternNotEqualSymbols] isComboAny:>> ', isComboAny);
    // console.log('[checkPatternNotEqualSymbols] linePattern:>> ', linePattern);
    if (isCombo) {
      winPattern.patterns.forEach((comboPattern) => {
        const isValidCombo = linePattern.includes(comboPattern.value);
        if (isValidCombo) {
          // console.log('[checkPatternNotEqualSymbols][combo] comboPattern:>> ', comboPattern.value);
          // console.log('[checkPatternNotEqualSymbols][combo] isValidCombo:>> ', isValidCombo);
          // console.log('[checkPatternNotEqualSymbols][combo] payTable:>> ', comboPattern.payTable);
          // const winLine = 'line-center-' + lineIndex;
          // const winLineData = {
          //   type: winPattern.type,
          //   line: lineIndex,
          //   side: comboPattern.side,
          // };
          // winLines.push(winLineData);
          const winLine = `line-${comboPattern.side}-${lineIndex}`;
          winLines.push(winLine);
          payTable.push(comboPattern.payTable);
          winAmount += winPattern.points;
        }
      });
    } else if (isComboAny) {
      const patternSymbols = winPattern.symbols;
      const isCenterSymbolValid = patternSymbols.includes(symbols[1]);
      // console.log('[checkPatternNotEqualSymbols] isCenterSymbolValid:>> ', isCenterSymbolValid);
      if (isCenterSymbolValid) {
        const comboLeft = patternSymbols.includes(symbols[0]);
        const comboRight = patternSymbols.includes(symbols[2]);
        // console.log('[checkPatternNotEqualSymbols] comboLeft:>> ', comboLeft);
        // console.log('[checkPatternNotEqualSymbols] comboRight:>> ', comboRight);
        // console.log(
        //   '[checkPatternNotEqualSymbols][isCenterSymbolValid] payTable:>> ',
        //   winPattern.payTable,
        // );
        // const winLineData = { type: winPattern.type };
        payTable.push(winPattern.payTable);
        if (comboLeft) {
          // winLineData.position = 'left';
          // winLines.push(winLineData);
          const winLine = `line-left-${lineIndex}`;
          winLines.push(winLine);
          winAmount += winPattern.points;
        }
        if (comboRight) {
          // winLineData.position = 'right';
          // winLines.push(winLineData);
          const winLine = `line-right-${lineIndex}`;
          winLines.push(winLine);
          winAmount += winPattern.points;
        }
      }
    }
  });
  return { winAmount, winLines, payTable };
}

function checkLine(symbols, lineIndex) {
  // console.log('[checkLine] symbols:>> ', symbols);
  // console.log('[checkLine] lineIndex:>> ', lineIndex);
  // console.log('[checkLine] isCenterSymbol:>> ', isCenterSymbol);
  let winAmount = 0;
  let winLines = [];
  let payTable = [];

  const linePattern = symbols.join('-');
  const isEmptyLine = linePattern === '-1--1--1';
  if (!isEmptyLine) {
    const testEqualSymbols = symbols.filter(filterDuplicates);
    const isAllSymbolsEqual = testEqualSymbols.length === 1;
    const result = isAllSymbolsEqual
      ? checkPatternEqualSymbols(linePattern, lineIndex)
      : checkPatternNotEqualSymbols(symbols, linePattern, lineIndex);

    if (result.winAmount > 0) {
      winAmount += result.winAmount;
      winLines.push(result.winLines);
      payTable.push(result.payTable);
    }
  }

  return { winAmount, winLines, payTable };
}
function calculateWin(winLinesData) {
  // console.log('[calculateSpinResult] winLinesData:>> ', winLinesData);
  let winAmount = 0;
  let arrLines = [];
  let payTable = [];
  Object.keys(winLinesData).forEach((rowIndex) => {
    const currentLine = winLinesData[rowIndex];
    const lineResult = checkLine(currentLine, rowIndex);
    // console.log('[calculateWin] lineResult:>> ', lineResult);

    if (lineResult.winAmount > 0) {
      winAmount += lineResult.winAmount;
      arrLines.push(lineResult.winLines);
      payTable.push(lineResult.payTable);
    }
  });

  const hasWin = winAmount > 0;
  const winLines = hasWin ? arrLines.flat(3) : [];
  const payTableLines = hasWin ? payTable.flat(3).filter(filterDuplicates) : [];

  return { hasWin, winAmount, winLines, payTableLines };
}

export { winLinesParams, calculateWin };
