# Personal Wallet Management WebApp

## Overview

The Personal Wallet Management WebApp is a comprehensive tool designed for individuals to manage their personal wallets across multiple currencies. The app supports a diverse range of currencies including USD, EUR, GBP, JPY, CHF, AUD, CAD, NZD, and PLN. Users can register to create a new account or log in to an existing one, ensuring secure access to their personal financial data. 

Upon logging in, the dashboard provides a dynamic overview of live forex market rates, the user's buy and sell order history, and a pie chart representing the user's holdings. Each section on the dashboard includes hyperlinks to detailed pages for an in-depth view. For example, the live market section links to a page displaying real-time bid and ask prices for all supported currencies along with live charts. The order history section links to a comprehensive page listing all the user's past orders, ordered by time. The wallet page presents an extensive breakdown of the user's financial statistics, making it easier for users to update their balances, monitor real-time price fluctuations, and observe real-time changes in their balance with respect to the US dollar.

## Distinctiveness and Complexity

This project is distinct due to its integration of multiple advanced features that collectively provide a robust personal wallet management system. The combination of user authentication, live forex data streaming, detailed financial statistics, and interactive charts makes it a comprehensive tool that stands out from other simpler projects.

1. **Live Forex Data Integration**: Unlike typical projects that use static data, this app uses TraderMade WebSocket for live forex data streaming, providing real-time updates on currency exchange rates. This real-time integration adds a layer of complexity and provides users with the most up-to-date information.

2. **Detailed Financial Analytics**: The app provides detailed financial analytics including balance gain percentage, holdings distribution, transaction volumes, and technical analysis. These features require complex calculations and dynamic data handling.

3. **Interactive Visualizations**: Using ApexCharts, the app offers interactive and visually appealing charts that display real-time data. These charts enhance user experience and provide an intuitive way to understand financial data.

4. **Multiple Currency Support**: Supporting multiple currencies adds another layer of complexity as the app needs to handle various currency conversions and updates in real-time.

5. **Comprehensive User Interface**: The user interface is designed to be intuitive and user-friendly, with hyperlinks to detailed pages for an in-depth view. This requires careful planning and design to ensure a seamless user experience.

## File Descriptions

- **models.py**: Defines the Django models for users, wallets, and orders. These models are the backbone of the app, managing the structure and relationships of the data.
  
- **views.py**: All the views functions for urls.py and Manages the logic for handling GET and PUT requests related to transactions and orders. It also updates wallet data based on user interactions.
  
- **urls.py**: Contains the URL configurations for routing different pages within the app, ensuring users can navigate seamlessly between sections.
  
- **templates/**: This directory houses the HTML files for various pages including the dashboard, live market, order history, and wallet. Each template is designed to display data dynamically and provide a cohesive user experience.
  
- **static/**: Contains static files such as CSS, JavaScript, and images. These files are used to style the app and enhance its functionality.
  
- **requirements.txt**: Lists all the Python packages required to run the web application. This file ensures that all necessary dependencies are installed.

## How to Run Your Application

1. **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2. **Create a virtual environment and activate it**:
    ```bash
    python3 -m venv env
    source env/bin/activate  # On Windows use `env\Scripts\activate`
    ```

3. **Install the required packages**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Migration**:
    ```bash
    python manage.py makemigrations portfolio
    ```

5. **Migrate**:
    ```bash
    python manage.py migrate
    ```

6. **Run the Django development server**:
    ```bash
    python manage.py runserver
    ```

7. **Navigate to the application**:
    Open your web browser and go to `http://127.0.0.1:8000/`.

## Additional Information

### Dashboard

The dashboard is the central hub of the app, providing a snapshot of the user's financial data. It includes:
- **Live Forex Rates**: Displays real-time exchange rates for selected currencies.
- **Order History**: Shows a summary of the user's buy and sell orders.
- **Holdings Pie Chart**: A visual representation of the user's asset distribution.

### Full Market Page

The full market page offers a detailed view of live bid and ask prices for all supported currencies. It also includes live charts for each currency, providing users with comprehensive market insights.

### Order History Page

This page lists all orders made by the user, ordered by time. It provides detailed information on each transaction, allowing users to track their trading activity over time.

### Wallet Page

The wallet page is divided into several sections:
1. **Current Balance**: Shows the user's current total balance in USD.
2. **Balance Gain Percentage**: Displays the user's balance gain percentage relative to the initial balance.
3. **Holdings Distribution**: A pie chart showing the distribution of the user's holdings in USD value.
4. **Balance Sheet**: Lists all assets held by the user, including amounts, initial values, live market prices, and current USD values.
5. **Transaction Volumes**: A bar chart showing the user's buy and sell volumes over time.
6. **Buy/Sell Section**: Allows users to select a currency from a dropdown menu, enter an amount, and either buy to add to the wallet or sell from the wallet, updating the user's balance in real-time.
7. **Technical Analysis Widget**: Provides a technical analysis for the EURUSD currency pair.
8. **Order History Table**: Lists the user's buy and sell orders.

### Data Handling and APIs

- **TraderMade WebSocket**: Used for streaming live forex data, providing real-time exchange rates.
- **ExchangeRate-API**: Provides exchange rate information used in various calculations within the app.
- **SQLite**: The app uses SQLite as the database to store user data, wallet information, and order details.

## Technologies Used

- Django
- Python
- HTML
- JavaScript
- HTML5
- CSS3
- Bootstrap
- ApexCharts
- Cloudinary
- TraderMade WebSocket
- ExchangeRate-API
- SQLite
- Tradingview Widgets

