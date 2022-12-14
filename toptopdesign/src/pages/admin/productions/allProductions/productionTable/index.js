import { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { ReactComponent as MoreIcon } from '../../../../../assets/img/admin/more_view.svg';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';

import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { suspendById, unSuspendById } from '../../../../../api/admin/users';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'PRODUCT ID',
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'NAME',
  },
  {
    id: 'tag',
    numeric: true,
    disablePadding: false,
    label: 'TAG',
  },
  {
    id: 'liked',
    numeric: true,
    disablePadding: false,
    label: 'LIKED',
  },
  {
    id: 'views',
    numeric: true,
    disablePadding: false,
    label: 'VIEWS',
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'var(--white)',
        fontFamily: 'var(--font-family-manrope-semi-bold)',
        fontSize: 'var(--font-size-12)',
        fontWeight: 600,
        color: 'var(--txt-gray)',
        height: 53,
        borderCollapse: 'initial',
    },
    '&': {
        height: 72,
        border: 'none', 
        padding: 0,
        fontFamily: 'var(--font-family-manrope-medium)',
        fontSize: 'var(--font-size-14)',
        fontWeight: 500,
        color: 'var(--charade)',
        borderCollapse: 'initial',
    }
}));

const StyledIDTableCell = styled(TableCell)(({ theme }) => ({
    '&': {
        fontFamily: 'var(--font-family-manrope-medium)',
        fontSize: 'var(--font-size-14)',
        fontWeight: 500,
        color: 'var(--txt-gray)',
        height: 72,
        border: 'none',
        padding: 0,
        borderCollapse: 'initial',
        cursor: 'pointer',
    }
}));

const StyledBoldTableCell = styled(TableCell)(({ theme }) => ({
    '&': {
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'var(--font-family-manrope-semi-bold)',
        fontSize: 'var(--font-size-14)',
        fontWeight: 600,
        color: 'var(--charade)',
        height: 72,
        border: 'none',
        padding: 0,
        borderCollapse: 'initial',
        position: 'relative',
    },
    '& .user-name': {
        marginLeft: 16,
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&': {
      backgroundColor: 'white',
      borderBottom: '1px solid #EBEAED'
    },
    '& > td': {
        height: '72px !important'
    },
}));

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <StyledTableRow>
        <StyledTableCell padding="checkbox">
            <Checkbox 
                sx={{
                    color: 'var(--txt-gray)',
                    '&.Mui-checked': {
                        color: 'var(--txt-gray)',
                    },
                }}
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{
                    'aria-label': 'select all desserts',
                }}
            />
        </StyledTableCell>
            {headCells.map((headCell) => (
            <StyledTableCell
                key={headCell.id}
                align='left'
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
            >
                <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                >
                {headCell.label}
                {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                ) : null}
                </TableSortLabel>
            </StyledTableCell>
            ))}
            <StyledTableCell
                align='right'
                padding='normal'
                sortDirection={orderBy === 'activeDate' ? order : false}
            >
                <TableSortLabel
                    active={orderBy === 'activeDate'}
                    direction={orderBy === 'activeDate' ? order : 'asc'}
                    onClick={createSortHandler('activeDate')}
                >
                {orderBy === 'activeDate' ? (
                    <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                ) : null}
                </TableSortLabel>
            </StyledTableCell>
      </StyledTableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function ProductionTable({ 
    productions, 
    getInitialData, 
    selected,
    setSelected,
    deleteProduct
}) {
    const navigate = useNavigate();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [selectedRow, setSelectedRow] = useState(null);

    const [anchorGift, setAnchorGift] = useState(null);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = productions.map((n) => n._id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
    };

    const openGiftMenu = (event, row) => {
        setAnchorGift(event.currentTarget);
        setSelectedRow(row);
    };

    const closeGiftMenu = () => {
        setAnchorGift(null);
    };
    const openGift = Boolean(anchorGift);

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const editProduct = () => {
        navigate(`/admin/productions/detail/${selectedRow._id}`); 
        closeGiftMenu()
    }

    return (
        <Box sx={{ width: '100%', mt: 4}}>
            <Paper sx={{ width: 'calc(100% - 45px)', height: 689, maxHeight: 689, mb: 4, padding: '24px 21px 15px 24px' }}>
                <TableContainer>
                <Table
                    aria-labelledby="tableTitle"
                    size="small"
                >
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={productions.length}
                    />
                    <TableBody>
                    {stableSort(productions, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                        const isItemSelected = isSelected(row._id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                            <StyledTableRow
                                hover
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row._id}
                                selected={isItemSelected}
                            >
                                <StyledTableCell padding="checkbox">
                                    <Checkbox 
                                        checked={isItemSelected} 
                                        sx={{
                                            color: 'var(--txt-gray)',
                                            '&.Mui-checked': {
                                                color: 'var(--txt-gray)',
                                            },
                                        }}
                                        onClick={(event) => handleClick(event, row._id)}
                                    />
                                </StyledTableCell>
                                <StyledIDTableCell
                                    component="td"
                                    id={labelId}
                                    scope="row"
                                    padding="none"
                                    onClick={() => navigate(`/admin/productions/detail/${row._id}`)}
                                >
                                <span>{row._id}</span>
                                </StyledIDTableCell>
                                <StyledBoldTableCell align="left">
                                    {row?.imageList?
                                        <img 
                                            src={`${process.env.REACT_APP_UPLOAD_URL}${row?.imageList[0]}`} 
                                            alt='' 
                                            style={{width: 38, height: 38, borderRadius: 38, position: 'absolute'}}
                                        />:<div style={{
                                                    width: 38, 
                                                    height: 38, 
                                                    borderRadius: 38, 
                                                    position: 'absolute',
                                                    backgroundColor: 'var(--gray)'
                                                }}></div>}
                                    
                                    <span className='user-name' style={{ paddingLeft: 54 }}>{row.productName}</span>
                                </StyledBoldTableCell>
                                <StyledTableCell align="left"><span>{row?.tags}</span></StyledTableCell>
                                <StyledTableCell align="left"><span>{row.liked}</span></StyledTableCell>
                                <StyledTableCell align="left"><span>{row.viewed}</span></StyledTableCell>
                                <StyledBoldTableCell align="right">
                                    <IconButton onClick={(e) => openGiftMenu(e, row)}>
                                        <MoreIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorGift}
                                        id="account-menu"
                                        open={openGift}
                                        onClose={closeGiftMenu}
                                        onClick={closeGiftMenu}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                boxShadow: '0px 0px 10px rgb(0 0 0 / 2%)',
                                                mt: 1.5,
                                                width: 101,
                                                borderRadius: 4,
                                                padding: '10px',
                                            },
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <MenuItem 
                                            onClick={() => editProduct()} 
                                            disableRipple
                                        >
                                            Edit
                                        </MenuItem>
                                        <Divider/>
                                        <MenuItem onClick={() => {
                                            deleteProduct(selectedRow._id);
                                            closeGiftMenu()
                                        }} disableRipple>
                                            Delete
                                        </MenuItem>
                                    </Menu>
                                </StyledBoldTableCell>
                            </StyledTableRow>
                        );
                        })}
                    </TableBody>
                </Table>
                </TableContainer>
            </Paper>
            <div style={{ display: 'flex', width: '100%'}}>
                <Pagination
                    sx={{ marginLeft: 'auto'}}
                    count={productions.length}
                    shape="rounded" 
                    onChange={handleChangePage}
                />
            </div>
        </Box>
    );
}
