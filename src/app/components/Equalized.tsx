import { useStoreAccessor } from '@app/contexts/Store/StoreAccessorContext';
import { Decimal } from '@app/library/base/Decimal';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Text, ThemeUIStyleObject } from 'theme-ui';

const Equalizer: React.FC<{
    styles: ThemeUIStyleObject,
    assetId: number,
    assetAmount: Decimal,
}> = observer((props) => {
    const storeAccessor = useStoreAccessor();

    const {styles, assetId, assetAmount} = props;

    //beam native asset
    if(assetId === 0 && assetAmount) {
        const beamPrice: Decimal = storeAccessor.rateStore.rate;
        return <Text variant='subText' sx={styles}><>{ assetAmount.isZero ? 0 : beamPrice.mul(assetAmount).prettify(2) } USD</></Text>;
    }


    return <Text variant='subText' sx={styles}>&nbsp;</Text>;
})

export default Equalizer;