

const createCheckoutButton = (preferenceId) => {
    const mp = new MercadoPago('YOUR_PUBLIC_KEY');
    const bricksBuilder = mp.bricks();

    const renderComponent = async () => {
        if(window.checkoutButton) window.checkoutButton.unmount();      //Evita que se generen multiples botones de checkout
        await bricksBuilder.create("wallet", "wallet_container", {
        initialization: {
            preferenceId: preferenceId,
        },
        customization: {
        texts: {
        valueProp: 'smart_option',
        },
        },
        });

    }
    renderComponent();
}

export {createCheckoutButton}