import React from "react"
import { Box, Slider, Table, Tbody, Td, Thead, Tr, Tfoot, Th, Input, Select, Text, Badge, SliderTrack, SliderFilledTrack, SliderThumb, Flex, IconButton, HStack, Button } from '@chakra-ui/react'
import { useTable, useSortBy, useAsyncDebounce, useGlobalFilter, useFilters, usePagination } from 'react-table'
import { matchSorter } from 'match-sorter'
import { GrClear } from 'react-icons/gr'
import 'regenerator-runtime'
import { IoPlayBackSharp, IoPlayForwardSharp, IoCaretBackSharp, IoCaretForwardSharp } from "react-icons/io5"

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}: {
    preGlobalFilteredRows: any,
    globalFilter: any,
    setGlobalFilter: any,
}) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <>
            Buscar:{' '}
            <Input
                mt="10px"
                variant="filled"
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${count} encontrados...`}
            />
        </>
    )
}

// @ts-ignore
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter }, }) {
    const count = preFilteredRows.length

    return (
        <Input
            mt="5px"
            variant="filled"
            size="sm"
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={`Buscar ${count} encontrados...`}
        />
    )
}

//@ts-ignore
export function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id }, }) {
    const options = React.useMemo(() => {
        const options = new Set()
        //@ts-ignore
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return (
        <Select
            size="sm"
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">Todos</option>
            {options.map((option: any, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </Select>
    )
}

// @ts-ignore
export function SliderColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id, render }, }) {
    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        // @ts-ignore
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <>
            <Slider
                min={min}
                max={max}
                defaultValue={filterValue || min}
                // @ts-ignore
                onChangeEnd={(val) => setFilter(parseInt(val, 10))}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider >
            <GrClear onClick={() => setFilter(undefined)} />
        </>
    )
}

//@ts-ignore
export function NumberRangeColumnFilter({ column: { filterValue = [], preFilteredRows, setFilter, id }, }) {
    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        //@ts-ignore
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <Flex alignItems="center">
            <Input
                variant="filled"
                size="sm"
                value={filterValue[0] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
                }}
                placeholder={`Min (${min})`}
                w="75px"
                mr="0.5rem"
            />
            a
            <Input
                variant="filled"
                size="sm"
                value={filterValue[1] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
                }}
                placeholder={`Max (${max})`}
                w="75px"
                ml="0.5rem"
            />
        </Flex>
    )
}



// @ts-ignore
function fuzzyTextFilterFn(rows, id, filterValue) {
    // @ts-ignore
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// @ts-ignore
fuzzyTextFilterFn.autoRemove = val => !val

interface MyReactTable {
    columns: any[],
    //@ts-ignore
    data:[],
    isPaginated? :boolean,
    pagesOptions? :number[],
    hasFilters? :boolean,
    skipPageReset? :boolean,
    updateMyData?:(ID:any)=>void
}
// @ts-ignore
export const MyReactTable = ({columns: userColumns, data, isPaginated = false, pagesOptions =[10, 20, 30, 40, 50], hasFilters = false, skipPageReset = false,updateMyData}:MyReactTable ) => {

    const filterTypes = React.useMemo(
        () => ({
            fuzzyText: fuzzyTextFilterFn,
            // @ts-ignore
            text: (rows, id, filterValue) => {
                // @ts-ignore
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )

    function lastFive(val: number) {
        let arr = []
        for (var _i = 0; _i < 2; _i++) {
            var element = val - _i;
            arr.push(element)
        }
        return arr.reverse();
    }

    function nextFive(val: number) {
        let arr = []
        for (var _i = 0; _i < 2; _i++) {
            var element = val + _i + 1;
            arr.push(element)
        }
        return arr;
    }

    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const myColumns = React.useMemo(
        () => userColumns,
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        footerGroups,
        visibleColumns,
        rows,
        // filtros
        //@ts-ignore
        state, preGlobalFilteredRows, setGlobalFilter,
        // pagination
        // @ts-ignore
        page, canPreviousPage, canNextPage, pageOptions, pageCount, gotoPage, nextPage, previousPage, setPageSize, state: { pageIndex, pageSize }
    } = useTable(
        {
            columns: myColumns,
            data,
            // @ts-ignore
            defaultColumn,
            autoResetPage: !skipPageReset,
            filterTypes,
            updateMyData,
            // @ts-ignore
            initialState: { pageIndex: 0, pageSize: pagesOptions[0] },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
    )

    return (
        <Box>
            <Table variant="simple" colorScheme="blue" {...getTableProps()}>
                <Thead>
                    {hasFilters &&
                        <Tr>
                            <Th colSpan={visibleColumns.length} textAlign="left">
                                <GlobalFilter
                                    preGlobalFilteredRows={preGlobalFilteredRows}
                                    // @ts-ignore
                                    globalFilter={state.globalFilter}
                                    setGlobalFilter={setGlobalFilter}
                                />
                            </Th>
                        </Tr>
                    }
                    {headerGroups.map((headerGroup) => (
                        <Tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                //@ts-ignore
                                <Th textAlign="center" {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {/* @ts-ignore */}
                                    {column.isSorted ? (column.isSortedDesc ? '🔼 ' : '🔽 ') : ''}
                                    {column.render('Header')}
                                    {hasFilters &&
                                        <Flex w="full" justifyContent="center" onClick={(event) => event.stopPropagation()}>
                                            {/* @ts-ignore */}
                                            {column.canFilter ? column.render('Filter') : null}
                                        </Flex>
                                    }
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {isPaginated ?
                        //@ts-ignore
                        page.map((row, i) => {
                            prepareRow(row)
                            return (
                                <Tr {...row.getRowProps()}>
                                    {/* @ts-ignore */}
                                    {row.cells.map(cell =>
                                        <Td textAlign="center" {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                                    )}
                                </Tr>
                            )
                        })
                        :
                        //@ts-ignore
                        rows.map((row, i) => {
                            prepareRow(row)
                            return (
                                <Tr {...row.getRowProps()}>
                                    {/* @ts-ignore */}
                                    {row.cells.map(cell =>
                                        <Td textAlign="center" {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                                    )}
                                </Tr>
                            )
                        })
                    }
                </Tbody>
                <Tfoot>
                    {footerGroups.map((footerGroup, i) => (
                        <Tr {...footerGroup.getFooterGroupProps()}>
                            {footerGroup.headers.map((column, i) =>
                                <Th {...column.getFooterProps()}>{column.render('Footer')}</Th>)
                            }
                        </Tr>
                    ))}
                </Tfoot>
            </Table>
            {isPaginated &&
                <HStack my="15px" borderWidth="1px" borderRadius="lg" p="10px" >
                    <IconButton aria-label="go-to-first" icon={<IoPlayBackSharp />} onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
                    <IconButton aria-label="go-back" icon={<IoCaretBackSharp />} onClick={() => previousPage()} disabled={!canPreviousPage} />
                    {
                        lastFive(pageIndex).filter(val => val >= 1)
                            .map((val, i) =>
                                <Button onClick={() => gotoPage(val - 1)} key={i}>{val}</Button>
                            )
                    }
                    <Button bg={"#3e49f9"} color={"white"} >{pageIndex + 1}</Button>
                    {
                        nextFive(pageIndex).filter(val => val <= pageCount - 1)
                            .map((val, i) =>
                                <Button onClick={() => gotoPage(val)} key={i}>{val + 1}</Button>
                            )
                    }
                    <IconButton aria-label="go-next" icon={<IoCaretForwardSharp />} onClick={() => nextPage()} disabled={!canNextPage} />
                    <IconButton aria-label="go-to-last" icon={<IoPlayForwardSharp />} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
                    <Badge bg={"#3e49f9"} color="white" fontSize="md">
                        Página{' '}
                        <strong>
                            {pageIndex + 1} de {pageOptions.length}
                        </strong>{' '}
                    </Badge>
                    <Text>
                        Ir a la página:{' '}
                    </Text>
                    <Input
                        size="sm"
                        variant="filled"
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                    <Select
                        size="sm"
                        w="200px"
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {pagesOptions.map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Mostrar {pageSize}
                            </option>
                        ))}
                    </Select>
                </HStack>
            }
        </Box>
    )
}

//@ts-ignore
export function filterGreaterThan(rows, id, filterValue) {
    //@ts-ignore
    return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue >= filterValue
    })
}

//@ts-ignore
filterGreaterThan.autoRemove = val => typeof val !== 'number'