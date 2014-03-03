	</div>
    <div class="footer">
        <div class="wrapper">
            <?php echo markdown($site->impressum()); ?>
        </div>
    </div>
	<?php echo js('assets/javascripts/script'.(c::get('environment','development') == 'production' ? '.min' : '').'.js') ?>
</body>
</html>