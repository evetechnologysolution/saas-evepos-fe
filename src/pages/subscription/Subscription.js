import { useState } from 'react';
// @mui
import {
    Button,
    Container,
    Stack,
} from '@mui/material';
// sections
import CurrentSubscription from '../../sections/@dashboard/subsciption/CurrentSubscription';
import SubscriptionHistory from '../../sections/@dashboard/subsciption/SubscriptionHistory';
import SubscriptionOffer from '../../sections/@dashboard/subsciption/SubscriptionOffer';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function Subscription() {
    const [isCurrent, setIsCurrent] = useState(true);

    const handleClick = () => setIsCurrent(!isCurrent);

    return (
        <Page title="Subscription" sx={{ height: 1 }}>
            <Container maxWidth={false} sx={{ height: 1 }}>
                <HeaderBreadcrumbs
                    heading="Subscription"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        { name: 'Subscription' },
                    ]}
                />
                <Stack flexDirection="row" mx="5vw" mb={3} justifyContent="flex-end">
                    <Button
                        sx={{ borderRadius: '8px 0 0 8px', boxShadow: '0', overflow: 'hidden' }}
                        size="large"
                        variant={isCurrent ? "contained" : "outlined"}
                        onClick={() => handleClick()}
                    >
                        Current Subscription
                    </Button>
                    <Button
                        sx={{ borderRadius: '0 8px 8px 0', boxShadow: '0', overflow: 'hidden' }}
                        size="large"
                        variant={!isCurrent ? "contained" : "outlined"}
                        onClick={() => handleClick()}
                    >
                        Subscription Offer
                    </Button>
                </Stack>
                {isCurrent ? (
                    <>
                        <CurrentSubscription handleClick={handleClick} />
                        <br />
                        <SubscriptionHistory />
                    </>
                ) : (
                    <SubscriptionOffer />
                )}
            </Container>
        </Page>
    );
}
