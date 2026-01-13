import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  Box,
  Card,
  Table,
  TableBody,
  Container,
  TableContainer,
  Typography,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import axiosInstance from 'src/utils/axios';
// routes
// hooks
import useSettings from 'src/hooks/useSettings';
import useTable from 'src/hooks/useTable';
// components
import Page from 'src/components/Page';
import Iconify from 'src/components/Iconify';
import Scrollbar from 'src/components/Scrollbar';
import { TableHeadCustom, TableNoData } from 'src/components/table';
// sections
// context
// utils
import CategoryBlogTableRow from 'src/sections/@dashboard/library/blog/Category';
import EditCategory from './EditCategory';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'center' },
  { id: '', label: 'Action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function TableCategory() {
  const { dense } = useTable();

  const { themeStretch } = useSettings();

  const { enqueueSnackbar } = useSnackbar();

  const [category, setCategory] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const getData = async () => {
      const url = `/blog/list-category`;

      try {
        await axiosInstance.get(url).then((response) => {
          setCategory(response.data?.name || []);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handleDialog = () => {
    setSelectedCategory('');
    setEdit(!edit);
  };

  const handleEditRow = (name) => {
    setEdit(true);
    setSelectedCategory(name);
  };

  return (
    <>
      <Page title="Blog Category - Evewash">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" mx={1}>
              Blog Category
            </Typography>

            <Grid container spacing={3} sx={{ marginTop: 0.5 }}>
              {/* Blog Table Section */}
              <Grid item xs={12} sm={6}>
                <Scrollbar>
                  <TableContainer
                    sx={{
                      minWidth: 768,
                      width: 768,
                      position: 'relative',
                      marginLeft: { xs: 0, md: 12 },
                    }}
                  >
                    <Table size={dense ? 'small' : 'medium'}>
                      <TableHeadCustom headLabel={TABLE_HEAD} rowCount={category.length} />
                      <TableBody>
                        {category.map((row, index) => (
                          <CategoryBlogTableRow
                            key={index}
                            row={row}
                            onEditRow={() => handleEditRow(row, index)}
                            onDeleteRow={(key) => setCategory((prev) => prev.filter((val) => val !== key))}
                          />
                        ))}
                        <TableNoData isNotFound={category.length === 0} />
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Grid>

              <Grid item xs={12} sm={6}>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();

                    const duplicateCount = category.filter((val) => val.startsWith(text)).length;

                    if (duplicateCount > 0) {
                      setCategory((prev) => [...prev, `${text}${duplicateCount + 1}`]);
                    } else {
                      setCategory((prev) => [...prev, text]);
                    }

                    setText('');
                  }}
                >
                  <TextField
                    name="category"
                    label="Category Name"
                    onChange={(event) => setText(event.target.value)}
                    fullWidth
                    value={text}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} type="submit">
                      Tambah
                    </Button>
                  </Box>
                </form>
              </Grid>
            </Grid>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                try {
                  setLoading(true);
                  const res = await axiosInstance.post('/blog/list-category', { name: category });
                  setCategory(res.data?.name);
                  enqueueSnackbar('Sukses menyimpan kategori ke database !', { variant: 'success' });
                } catch (error) {
                  enqueueSnackbar('Terjadi kesalah saat menyimpan data', { variant: 'error' });
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: category.length !== 0 ? 10 : 2,
                }}
              >
                <Button variant="contained" type="submit" loading={loading}>
                  Simpan Kategori
                </Button>
              </Box>
            </form>
            <Box sx={{ pb: 2, opacity: 0 }}>
              <div>a</div>
            </Box>
          </Card>
        </Container>
      </Page>

      {/* Confirm Delete Modal */}
      <EditCategory
        open={edit}
        onClose={handleDialog}
        selectedCategory={selectedCategory}
        category={category}
        setCategory={setCategory}
      />
    </>
  );
}
