// sections
import {
  TableComponent,
} from '../../sections/@dashboard/app';
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function Sales() {
  return (
    <Page title="Sales Report">
      <TableComponent />
    </Page>
  );
}
