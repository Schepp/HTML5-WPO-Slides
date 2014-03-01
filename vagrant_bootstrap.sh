sudo apt-get update
sudo apt-get -y install apache2 php5

if [ ! -h /var/www ];
then
    rm -rf /var/www
    sudo ln -s /vagrant /var/www

    a2enmod rewrite

    sed -i '/AllowOverride None/c AllowOverride All' /etc/apache2/sites-available/default
fi

service apache2 restart